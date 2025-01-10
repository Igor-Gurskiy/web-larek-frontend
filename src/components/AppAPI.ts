import { Api, ApiListResponse } from './base/api';
import { ICard, IOrder, IOrderResult, IAppAPI } from '../types';

export class AppAPI extends Api implements IAppAPI {
	constructor(baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
	}

	getCardCatalog(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) => {
			return data.items;
		});
	}

	setOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
