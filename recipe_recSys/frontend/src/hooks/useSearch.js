import { useState } from 'react';
import axios from 'axios';

const searchApi = (setLoading) => {
    const [searchResult, setResult] = useState([]);

    const makeSearch = (query) => {
        window.alert('niama')
        axios.post('/api/search/', {
            query: query,
          })
          .then((response) => {
            setLoading(false);
            setResult(response.data);
          }, (error) => {
            console.log(error);
          });
        }

    return [searchResult, makeSearch];
};

export default searchApi