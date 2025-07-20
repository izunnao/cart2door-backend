import { sendMail } from "../notification/services.js";
import { templatePayloads } from "../notification/utils/payload.temp.notification.js";
import { PaginationI } from "../types/general.types.js";
import { throwErrorOn } from "./AppError.js";
import { HIGH_LEVEL_ALERT_MAILS } from "./constants.js";
import memoryManager from "./memory.js";
import redis from "./redis.js";
import { retry } from "./retry.js";


/**
 * Converts pagination parameters from client-friendly format to database-friendly format
 * 
 * @param itemsPerPageRaw - String from query params: how many items to show per page (client provides)
 * @param pageNumberRaw - String from query params: which page to show (1-based index from client)
 */
export const calcPayloadPagination = (itemsPerPageRaw: string, pageNumberRaw: string) => {
  const itemsPerPage = parseInt(itemsPerPageRaw);
  const pageNumber = parseInt(pageNumberRaw);

  return {
    limit: Number.isNaN(itemsPerPage) || itemsPerPage <= 0 ? 10 : itemsPerPage,  // Number of items per page (defaults to 10 if invalid)
    page: Number.isNaN(pageNumber) || pageNumber <= 0 ? 0 : pageNumber - 1, // 0-based index for database queries (converted from client's 1-based index)
  };
};


export const calcResponsePagination = (totalData: number, limit: number, page: number,): PaginationI => ({
  total: Math.ceil(totalData / limit),
  limit,
  page: page + 1,
  hasMore: (page) * limit < totalData,
})



export const getPublicFXRate = async (): Promise<number | undefined> => {
  try {
    const publicFXRate = memoryManager.get('publicFXRate')

    if (Number(publicFXRate)) {
      return Number(publicFXRate)
    }

    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/GBP'

    const response = await retry(async () => await fetch(apiUrl))
    const data = await response.json();

    if (data.rates && data.rates.NGN) {
      const nairaRate = Math.round(data.rates.NGN);

      memoryManager.set('publicFXRate', nairaRate)

      return nairaRate;
    } else {
      console.log('cant fetch fx rate...');
      sendMail({
        to: HIGH_LEVEL_ALERT_MAILS,
        subject: 'Fetching FX RATE FAILED',
        context: 'fxRateAlertEmailI',
        payload: templatePayloads.fxRateAlertEmailI({ apiUrl, errorMessage: JSON.stringify(data), timestamp: new Date().toISOString(), retryCount: 3 })
      })

      throwErrorOn(true, 500, 'Something is wrong, wait a little bit, we are working on it..')
    }
  } catch (error) {
    console.log(' error geting fx rate ', error);
    // TODO: Trigger alarm
    throwErrorOn(true, 500, 'We are working on it...')
  }
};

export const converGBPToNaira = (gbp: number, fxRate: number) => {
  return gbp * fxRate
}

export const calcInternalFXRate = (fxRate: number) => {
  return fxRate * 1.15;
}