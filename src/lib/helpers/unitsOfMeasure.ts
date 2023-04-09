import { UnitsOfMeasure, type IUnitOfMeasure } from "$lib/constants/ingredients";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const getUnitOfMeasure = (uomName: string): IUnitOfMeasure | undefined => Object.values(UnitsOfMeasure).find(u => u.name === uomName);

export const getUnitOfMeasureAbbv = (uom: IUnitOfMeasure | string, amount?: number) => {
  let unitOfMeasure: IUnitOfMeasure;

  if (typeof uom !== 'string') unitOfMeasure = uom;

  if (typeof uom === 'string') {
    const u = getUnitOfMeasure(uom);
    if (!u) return '';
    unitOfMeasure = u;
  } else {
    unitOfMeasure = uom;
  }

  if (!amount || amount === 1) return unitOfMeasure.abbv;

  switch (unitOfMeasure.abbv) {
    case '--': return '';
    case 'pinch': return 'pinches';
    case 'mL': return 'mLs';
    case 'lb': return 'lbs';
    default: return unitOfMeasure.abbv;
  }
}