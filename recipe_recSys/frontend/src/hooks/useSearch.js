import { useState } from 'react';
import axios from 'axios';

const searchApi = () => {
    const [searchResult, setResult] = useState([]);
    // const [errorMessage, setErrorMessage] = useState("");

    const makeSearch = (query) => {
        window.alert(query)
        axios.post('/api/search/', {
            query: query,
          })
          .then((response) => {
            setResult(response.data);
          }, (error) => {
            console.log(error);
          });
        }

    return [searchResult, makeSearch];
};

export default searchApi