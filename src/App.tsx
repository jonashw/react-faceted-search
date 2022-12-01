import React from 'react';
import Search from './components/Search';
import { CreateFacetedIndex } from './model';
import artworks from './sample-data/artworks.json';

const App = () => {
  const index = 
    CreateFacetedIndex(artworks, {
      facet_term_parents: {
        color: {
          'Red':'Warm',
          'Orange':'Warm',
          'Yellow':'Warm',
          'Blue': 'Cool',
          'Green': 'Cool',
          'Indigo': 'Cool',
        }
      },
      fields: {
        display: new Set(['title']),
        facet: new Set(['color','media','size'])
      }
    });
  return <Search index={index}/>;
};

export default App;