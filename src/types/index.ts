// Интерфейс одной карточки
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	index?: number;
}

// Интерфейс всех карточек
export interface ICardCatalog {
	total: number;
	items: ICard[];
}

// Интерфейс страницы
export interface IPage {
	catalog: ICard[];
	counter: number;
}

// Интерфейс корзины
export interface IBasket {
	cadrList: HTMLElement[];
	total: number;
	valid: boolean;
}

// Интерфейс формы контактов
export interface IContactsForm {
	email: string;
	phone: string;
}

// Интерфейс формы оплаты
export interface IPaymentForm {
	payment: string;
	address: string;
}

// Интерфейс заказа с формами
export interface IOrder extends IContactsForm, IPaymentForm {
	items: string[];
	total: number;
}

// Интерфейс успешного заказа
export interface IOrderResult {
	total: number;
}

// Интерфейс состояния приложения
export interface IAppState {
	catalogCards: ICard[];
	order: IOrder;
}

// Интерфейс API
export interface IAppAPI {
	getCardCatalog: () => Promise<ICard[]>;
	setOrder: (order: IOrder) => Promise<IOrderResult>;
}

// Интерфейс событий
export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;