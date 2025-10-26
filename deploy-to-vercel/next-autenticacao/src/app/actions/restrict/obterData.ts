'use server'

import { requireUser } from '../requireUser';

export default async function obterData(): Promise<Date> {
  await requireUser();
  return Promise.resolve(new Date());
}
