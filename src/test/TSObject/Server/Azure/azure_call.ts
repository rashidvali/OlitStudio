// const axios = require('axios');
import axios from "axios";

const query = `
query {
  allProducts {
    id
    name
    price
  }
}
`;

axios({
  url: 'https://<your-api-management-instance>.azure-api.net/graphql',
  method: 'post',
  headers: {
    'Ocp-Apim-Subscription-Key': '<your-subscription-key>',
    'Content-Type': 'application/json'
  },
  data: JSON.stringify({ query })
})
.then((result: any) => {
  console.log(result.data);
})
.catch((error: any) => {
  console.error(error);
});
