import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IPaymentForm, IContactsForm } from '../../types';

interface IFormState {
	valid: boolean;
	errors: string[];
}

// Класс формы
export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'.button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

export class FormPayment extends Form<IPaymentForm> {
	protected _onlineButton: HTMLButtonElement;
	protected _uponReceiptButton: HTMLButtonElement;
	protected _address: HTMLInputElement;
	protected _payment: string;
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this._onlineButton = ensureElement<HTMLButtonElement>(
			'.button[name=card]',
			this.container
		);
		this._uponReceiptButton = ensureElement<HTMLButtonElement>(
			'.button[name=cash]',
			this.container
		);
		this._address = ensureElement<HTMLInputElement>(
			'.form__input',
			this.container
		);

		this._onlineButton.addEventListener('click', () => {
			this._payment = 'card';
			this._onlineButton.classList.add('button_alt-active');
			this._uponReceiptButton.classList.remove('button_alt-active');
			this.onInputChange('payment', this._payment);
		});
		this._uponReceiptButton.addEventListener('click', () => {
			this._payment = 'cash';
			this._uponReceiptButton.classList.add('button_alt-active');
			this._onlineButton.classList.remove('button_alt-active');
			this.onInputChange('payment', this._payment);
		});
		this._address.addEventListener('input', () => {
			this.onInputChange('address', this._address.value);
		});

		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit('contacts:open');
		});
	}

	protected onInputChange(field: keyof IPaymentForm, value: string) {
		this.events.emit('formPayment:change', { field, value });
	}

	set address(value: string) {
		this._address.value = value;
	}

	set payment(value: string) {
		this._uponReceiptButton.classList.remove('button_alt-active');
		this._onlineButton.classList.remove('button_alt-active');
		this._payment = value;
	}

	validationFormPayment() {
		return this._payment !== '' && this._address.value ? true : false;
	}
}

export class FormContacts extends Form<IContactsForm> {
	protected _phone: HTMLInputElement;
	protected _email: HTMLInputElement;
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this._phone = ensureElement<HTMLInputElement>(
			'.form__input[name=phone]',
			this.container
		);
		this._email = ensureElement<HTMLInputElement>(
			'.form__input[name=email]',
			this.container
		);

		this._phone.addEventListener('input', () => {
			this.onInputChange('phone', this._phone.value);
		});
		this._email.addEventListener('input', () => {
			this.onInputChange('email', this._email.value);
		});

		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit('order:send');
		});
	}

	protected onInputChange(field: keyof IContactsForm, value: string) {
		this.events.emit('formContacts:change', { field, value });
	}

	set phone(value: string) {
		this._phone.value = value;
	}

	set email(value: string) {
		this._email.value = value;
	}

	validationFormContacts() {
		return this._phone.value && this._email.value ? true : false;
	}
}
