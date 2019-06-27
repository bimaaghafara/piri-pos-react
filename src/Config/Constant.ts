
const devMode = true;
const production = !devMode;

const APP_CONSTANT = {
  BASE_AUTH_API_URL: `http://piri-${(production) ? 'prod' : 'dev'}-api-auth.azurewebsites.net`,
  BASE_POS_API_URL: `http://piri-${(production) ? 'prod' : 'dev'}-api-pos.azurewebsites.net/resources`,
  BASE_POS_API_DOMAIN: `http://piri-${(production) ? 'prod' : 'dev'}-api-pos.azurewebsites.net`,
  BASE_MERCHANT_API_URL: `http://piri-${(production) ? 'prod' : 'dev'}-api-merchant.azurewebsites.net/resources`,
  BASE_MERCHANT_API_DOMAIN: `http://piri-${(production) ? 'prod' : 'dev'}-api-merchant.azurewebsites.net`,

  PUSHER_APP_ID: `${(production) ? '486902' : '486900'}`,
  PUSHER_KEY: `${(production) ? '618a7c536cf445aeb8f4' : '38f62d7687ba73270558'}`,
  PUSHER_CLUSTER: `ap1`,

  STORAGE_KEY: {
    ACCESS_TOKEN: 'AuthAccessToken',
    REFRESH_TOKEN: 'AuthRefreshToken',
    CREDENTIAL_INFO: 'CredentialInfo',
    SELECTED_MERCHANT: 'SelectedMerchant',
    SELECTED_OUTLET: 'SelectedOutlet',
    SELECTED_OUTLET_NAME: 'SelectedOutletName',
    REMEMBERED_USERS : 'RememberedUsers',
  },

  ORDER_REFRESH_INTERVAL: 300000,

  DEVMODE: devMode,
  PRODUCTION: production,  

};

export default APP_CONSTANT;
