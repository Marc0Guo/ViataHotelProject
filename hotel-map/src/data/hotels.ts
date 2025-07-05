import type { Hotel } from '../types/hotel';
import seattleHotels from '../../seattle_hotel_data.json';

export const hotels: Hotel[] = seattleHotels as Hotel[];

export default hotels;