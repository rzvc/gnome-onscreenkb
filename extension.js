/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

// Reference: https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/keyboard.js


const GETTEXT_DOMAIN = 'on-screen-kb';

const { GObject, St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const Gio = imports.gi.Gio;

const _ = ExtensionUtils.gettext;

const SCREEN_KEYBOARD_ENABLED = 'screen-keyboard-enabled';

const Indicator = GObject.registerClass(
	class Indicator extends PanelMenu.Button
	{
		_init()
		{
			super._init(0.0, _('On Screen KB Toggle Button'));

			this.add_child(new St.Icon({
				icon_name: 'input-keyboard-symbolic',
				style_class: 'system-status-icon',
			}));

			this.connect('button-press-event', () => this.toggleKb());
		}

		toggleKb()
		{
			const visible = Main.keyboard._a11yApplicationsSettings.get_boolean(SCREEN_KEYBOARD_ENABLED)
							&& Main.keyboard.visible;

			if (visible)
			{
				Main.keyboard._a11yApplicationsSettings.set_boolean(SCREEN_KEYBOARD_ENABLED, false);
				Main.keyboard.close();
			}
			else
			{
				Main.keyboard._a11yApplicationsSettings.set_boolean(SCREEN_KEYBOARD_ENABLED, true);
				Main.keyboard.open(0);
			}
		}
	}
);

class Extension
{
	constructor(uuid)
	{
		this._uuid = uuid;

		ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
	}

	enable()
	{
		this._indicator = new Indicator();
		Main.panel.addToStatusArea(this._uuid, this._indicator);
	}

	disable()
	{
		this._indicator.destroy();
		this._indicator = null;
	}
}

function init(meta)
{
	return new Extension(meta.uuid);
}
