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



export const getFXRate = async (): Promise<number | undefined> => {
  try {
    const fxRate = redis.get('fxRate')

    if (Number(fxRate)) {
      return Number(fxRate)
    }

    const response = await retry(async () => await fetch('https://api.exchangerate-api.com/v4/latest/GBP'))
    const data = await response.json();

    if (data.rates && data.rates.NGN) {
      return Math.round(data.rates.NGN)
    } else {
      return undefined
    }
  } catch (error) {
    console.log(' error geting fx rate ', error);
    return undefined
  }
};