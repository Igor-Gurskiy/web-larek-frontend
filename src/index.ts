import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { AppAPI } from './components/AppAPI';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { FormPayment, FormContacts } from './components/common/Forms';
import { Success } from './components/common/Success';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ICard } from './types/index';
import { IPaymentForm, IContactsForm } from './types/index';

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new AppAPI(API_URL);
const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);

const order = new FormPayment(cloneTemplate(orderTemplate), events);
const contacts = new FormContacts(cloneTemplate(contactsTemplate), events);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Изменились элементы каталога
events.on('catalog:change', (catalog: ICard[]) => {
	page.catalog = catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
	page.counter = appData.order.items.length;
});

events.on('card:select', (item: ICard) => {
	appData.setPreview(item);
});

// Открываем корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Открываем карточку
events.on('preview:changed', (item: ICard) => {
	const showItem = (item: ICard) => {
		const card = new Card(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				appData.hasCard(item.id)
					? events.emit('cardBasket:delete', item)
					: events.emit('cardBasket:add', item);
				page.counter = appData.order.items.length;
			},
		});
		card.textButton = appData.hasCard(item.id);
		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				price: item.price,
			}),
		});
	};
	if (item) {
		showItem(item);
	} else {
		modal.close();
	}
});

events.on('cardBasket:delete', (item: ICard) => {
	appData.deleteCard(item.id);
	modal.close();
});

events.on('cardBasket:add', (item: ICard) => {
	appData.addCard(item.id);
	modal.close();
});

events.on('formErrors:change', (errors: Partial<IPaymentForm>) => {
	const { payment, address } = errors;
	order.errors = Object.values({ payment, address })
		.filter((item) => !!item)
		.join('; ');
});

// Открываем форму оплаты
events.on('order:open', () => {
	appData.order.total = appData.getTotal(appData.catalogCards);
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('formPayment:change', () => {
	order.valid = order.validationFormPayment();
});

events.on('formErrors:change', (errors: Partial<IContactsForm>) => {
	const { phone, email } = errors;
	contacts.errors = Object.values({ phone, email })
		.filter((item) => !!item)
		.join('; ');
});

// Открываем форму контактов
events.on('contacts:open', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('formContacts:change', () => {
	contacts.valid = contacts.validationFormContacts();
});

events.on('success:open', () => {
	api
		.setOrder(appData.order)
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: appData.getTotal(appData.catalogCards),
				}),
			});
			appData.clearBasket();
			page.counter = appData.order.items.length;
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось одно из полей
events.on(
	'formPayment:change',
	(data: { field: keyof IPaymentForm; value: string }) => {
		appData.setPaymentField(data.field, data.value);
	}
);

events.on(
	'formContacts:change',
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Изменились элементы корзины
events.on('basket:open', () => {
	basket.cardList = appData.catalogCards
		.filter((item) => appData.hasCard(item.id))
		.map((item, index) => {
			const card = new Card(cloneTemplate(cardBasketTemplate), {
				onClick: () => {
					events.emit('cardBasket:delete', item);
					page.counter = appData.order.items.length;
					events.emit('basket:open');
				},
			});
			return card.render({
				title: item.title,
				price: item.price,
				index: (card.index = index),
			});
		});
	return basket.render({
		valid: appData.order.items.length > 0,
		total: appData.getTotal(appData.catalogCards),
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем карточки с сервера
api
	.getCardCatalog()
	.then((catalog) => appData.setCatalogCards(catalog))
	.catch((err) => {
		console.error(err);
	});
