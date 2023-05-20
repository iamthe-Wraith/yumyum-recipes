import { UnitsOfMeasure, type IUnitOfMeasure } from '$lib/constants/ingredients';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const getUnitOfMeasure = (uomName?: string): IUnitOfMeasure | undefined => Object.values(UnitsOfMeasure).find(u => u.name === uomName);

export const getUnitOfMeasureAbbv = (uom?: IUnitOfMeasure | string, amount?: number) => {
  if (!uom) return UnitsOfMeasure.find(u => !u.name)?.abbv;

  if ((typeof uom !== 'string' && !(uom as IUnitOfMeasure).abbv)) {
    return UnitsOfMeasure.find(u => !u.name)?.abbv;
  }

  const u = getUnitOfMeasure(typeof uom === 'string' ? uom : (uom as IUnitOfMeasure).name);

  if (!u) return UnitsOfMeasure.find(u => !u.name)?.abbv;

  if (typeof amount !== 'number' || amount === 1) return u.abbv;

  switch (u.abbv) {
    case '--': return '';
    case 'pinch': return 'pinches';
    case 'mL': return 'mLs';
    case 'lb': return 'lbs';
    default: return u.abbv;
  }
};