import { throwErrorOn } from "./AppError.js";
import redis from "./redis.js";
import { retry } from "./retry.js";

export const getPagination = (limitRaw: any, pageRaw: any) => {
  const limit = parseInt(limitRaw);
  const page = parseInt(pageRaw);

  return {
    limit: Number.isNaN(limit) || limit <= 0 ? 10 : limit,
    page: Number.isNaN(page) || page < 0 ? 0 : page,
  };
};



export const getPublicFXRate = async (): Promise<number | undefined> => {
  try {
    const publicFXRate = await redis.get('publicFXRate')

    console.log('redis - ', publicFXRate)

    if (Number(publicFXRate)) {
      return Number(publicFXRate)
    }

    const response = await retry(async () => await fetch('https://api.exchangerate-api.com/v4/latest/GBP'))
    const data = await response.json();

    if (data.rates && data.rates.NGN) {
      const nairaRate = Math.round(data.rates.NGN);

      redis.set('publicFXRate', nairaRate)
      return nairaRate;
    } else {
      // TODO: Trigger alarm
      throwErrorOn(true, 500, 'We are working on it...')
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