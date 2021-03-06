/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewWithToolbar } from '../../types/view';
import { View } from './view';
import { JoditToolbarCollection } from '../toolbar/joditToolbarCollection';
import { splitArray } from '../helpers/array';
import { STATUSES } from '../Component';
import { Dom } from '../Dom';
import { IToolbarCollection } from '../../types';

export class ViewWithToolbar extends View implements IViewWithToolbar {
	private __toolbar = JoditToolbarCollection.makeCollection(this);
	get toolbar(): IToolbarCollection {
		return this.__toolbar;
	}

	/**
	 * Change panel container
	 * @param element
	 */
	setPanel(element: HTMLElement | string): void {
		this.jodit.options.toolbar = element;
		this.buildToolbar(this.container);
	}

	protected buildToolbar(container: HTMLElement) {
		if (!this.options.toolbar) {
			return;
		}

		let toolbarContainer: HTMLElement | null = container.querySelector(
			'.jodit_toolbar_container'
		);

		if (!toolbarContainer) {
			toolbarContainer = this.create.div(
				'jodit_toolbar_container'
			);

			Dom.appendChildFirst(container, toolbarContainer);
		}

		if (
			this.options.toolbar instanceof HTMLElement ||
			typeof this.options.toolbar === 'string'
		) {
			toolbarContainer = this.resolveElement(this.options.toolbar);
		}

		this.toolbar.build(
			splitArray(this.options.buttons).concat(this.options.extraButtons),
			toolbarContainer
		);
	}

	destruct() {
		this.setStatus(STATUSES.beforeDestruct);
		this.toolbar.destruct();
		delete this.__toolbar;
		super.destruct();
	}
}
