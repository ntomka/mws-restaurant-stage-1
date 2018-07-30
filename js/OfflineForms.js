import DBHelper from './dbhelper';
import nativeToast from 'native-toast';

class OfflineForms {
  /**
   * setup the instance.
   */
  constructor() {
    this.forms = {};
    this.toastMessageConfig = {
      square: true,
      position: 'bottom',
      timeout: 5000
    };

    window.addEventListener('online', () => this.checkStorage());
    window.addEventListener('load', () => this.checkStorage());
  }

  submit(sendMethod, formData, offlineData = false) {
    const formId = `${sendMethod}-${formData.get('restaurant_id')}-${new Date().getTime()}`;

    this.forms[formId] = {
      data: formData,
      sendMethod: sendMethod
    };

    return new Promise((resolve, reject) => {
      if (!navigator.onLine) {
        // user is offline, store data on device.
        this.storeData();
        reject();
      }

      DBHelper[sendMethod](formData)
        .then(result => {
          if (offlineData) {
            this.sent(result);
          }
          resolve(result);
        })
        .catch(error => {
          console.error(error);
          this.warn();
          this.storeData();
          reject();
        });
    });
  }

  warn() {
    nativeToast(
      Object.assign({}, this.toastMessageConfig, {
        message: `<div class="message">
        <strong>Network error occured!</strong>
        <br>We will retry sending when you are online again.</div>`,
        type: 'error'
      })
    );
  }

  sent(formData) {
    nativeToast(
      Object.assign({}, this.toastMessageConfig, {
        message: `<div class="message">
        <strong>Network connection restored. Your previously message sent.</strong>
        <br>You can reload the page to see the content.
        <br>Message: ${formData.comments.substr(0, 200)}...
      </div>`,
        type: 'success'
      })
    );
  }

  storeData() {
    for (const formId in this.forms) {
      if (this.forms.hasOwnProperty(formId)) {
        const formData = this.forms[formId].data;
        const sendMethod = this.forms[formId].sendMethod;
        const object = {};

        formData.forEach((value, key) => {
          object[key] = value;
        });

        DBHelper.storeOfflineForm({
          formid: formId,
          data: object,
          sendMethod: sendMethod
        });
      }
    }
  }

  checkStorage() {
    DBHelper.getOfflineForms().then(formDatas => {
      formDatas.forEach(entry => {
        const formId = entry.formid;
        const sendMethod = entry.sendMethod;
        const formData = new FormData();

        for (const field in entry.data) {
          if (entry.data.hasOwnProperty(field)) {
            formData.set(field, entry.data[field]);
          }
        }

        this.submit(sendMethod, formData, true)
          .then(DBHelper.removeOfflineForm(formId))
          .catch(DBHelper.removeOfflineForm(formId));
      });
    });
  }
}

export default new OfflineForms();
