import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useNumberOfDays = () => {
  const items = useSelector((state: RootState) => state.campaign.searchParams);
  console.log('items', items);

  if (items?.date_from && items?.date_to) {
    const dateFrom = new Date(items.date_from);
    console.log('dateFrom', dateFrom);

    const dateTo = new Date(items.date_to);
    const differenceInTime = dateTo.getTime() - dateFrom.getTime();
    return differenceInTime / (1000 * 60 * 60 * 24);
  }
  return 0;
};
