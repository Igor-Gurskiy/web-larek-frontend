import { Model } from './base/Model';
import {
	FormErrors,
	ICard,
	IAppState,
	IOrder,
	IPaymentForm,
	IContactsForm,
} from '../types';

export class AppState extends Model<IAppState> {
	catalogCards: ICard[] = [];
	basketCards: ICard[];
	order: IOrder = {
		items: [],
		total: 0,
		payment: '',
		address: '',
		email: '',
		phone: '',
	};
	preview: string | null;
	formErrors: FormErrors = {};

	setCatalogCards(cards: ICard[]) {
		this.catalogCards = cards;
		this.events.emit('catalog:change', this.catalogCards);
	}

	clearBasket() {
		this.order.items = [];
	}

	getTotal(data: ICard[]) {
		return data
			.filter((item) => this.order.items.includes(item.id))
			.reduce((a, c) => a + c.price, 0);
	}

	hasCard(id: string) {
		return this.order.items.some((item) => item === id);
	}

	deleteCard(id: string) {
		this.order.items = this.order.items.filter((item) => item !== id);
	}

	addCard(id: string) {
		this.order.items.push(id);
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.events.emit('preview:changed', item);
	}

	setPaymentField(field: keyof IPaymentForm, value: string) {
		this.order[field] = value;

		if (this.validatePayment()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactsField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	protected validatePayment() {
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	protected validateContacts() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
