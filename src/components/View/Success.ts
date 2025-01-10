import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IOrderResult, IActions } from '../../types';

export class Success extends Component<IOrderResult> {
	protected _close: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: IActions) {
		super(container);

		this._close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._total = this.container.querySelector('.order-success__description');

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(total: number) {
		this.setText(this._total, `Списано ${total} синапсов`);
	}
}
