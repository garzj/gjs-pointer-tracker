import { ExtensionMetadata } from '@girs/gnome-shell/extensions/extension';
import Adw from 'gi://Adw';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import {
  gettext as _,
  pgettext,
} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const developers = ['garzj https://github.com/garzj/'];

const copyright = '© 2024 garzj';
const developerName = 'garzj';
const issueUrl = 'https://github.com/garzj/gjs-pointer-tracker/issues/';

export const AboutRow = GObject.registerClass(
  class AboutRow extends Adw.ActionRow {
    constructor(metadata: ExtensionMetadata) {
      super({
        title: _('About'),
        subtitle: _('Extension information'),
        activatable: true,
      });

      const dialog = new Adw.AboutDialog({
        application_name: metadata.name,
        comments: metadata.description,
        copyright: copyright,
        developer_name: developerName,
        developers: developers,
        issue_url: issueUrl,
        license_type: Gtk.License.GPL_3_0,
        release_notes_version: metadata['version-name'],
        translator_credits: pgettext(
          '(USER)NAME EMAIL/URL',
          'translator_credits',
        ),
        version: metadata['version-name'],
        website: metadata.url,
      });

      this.connect('activated', () => {
        dialog.present(this);
      });
    }
  },
);
