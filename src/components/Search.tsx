import React from 'react';
import {  defaultUiSettings, FacetedIndexInstance, GetDefaultSearchResult, Query, QueryUtil, SearchState, uiSettingControls } from '../model';
import RecordTermTable from './RecordTermTable';
import SearchFilters from './SearchFilters';
import ActiveFilters from './ActiveFilters';
import Pagination from './Pagination';

function Search({
  index
} : {
  index: FacetedIndexInstance
}) {
  let [state,setState] = React.useState<SearchState>({
    ix: index,
    searchResult: GetDefaultSearchResult(),
    pageNumber: 1,
    query: {}, 
    searchString: '',
    uiSettingControls,
    uiSettings: defaultUiSettings
  });

  //const [offCanvasOpen, setOffCanvasOpen] = React.useState(false);

  const search = React.useCallback((searchString: string, query: Query) => {
    let searchResult = state.ix.search(query,searchString);
    setState({...state, searchResult, query, searchString});
  },[state]);

  const initialSearchExecuted = React.useRef<boolean>(false);
  React.useEffect(() => {
    if(!initialSearchExecuted.current){
      search(state.searchString, state.query);
      console.log('initial search')
      initialSearchExecuted.current = true;
    }
  },[search, state]);

  const toggleQueryTerm = (facet_id: string, term: string) => {
    let query = QueryUtil.toggleFacetTerm(state.query, facet_id, term);
    search(state.searchString, query);
  };
  const pagination = 
    <div className="mb-3">
      <Pagination
        recordCount={state.searchResult.records.length} 
        pageSize={state.uiSettings.pageSize}
        currentPageNumber={state.pageNumber}
        setCurrentPageNumber={pageNumber => setState({...state, pageNumber})}
      />
    </div>;
  const uiOptions = 
    <div className="d-flex justify-content-between align-items-end">
      {pagination}
      <div className="d-flex justify-content-end">
        {uiSettingControls.map(control => 
          <div key={control.label} className="mb-3 ms-3">
            <label className="mb-1">{control.label}</label>
            <select
              className="form-select form-select-sm"
              value={control.getter(state.uiSettings)}
              onChange={e => setState({...state, uiSettings: control.setter(state.uiSettings, e.target.value) }) }
            >
              {control.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>)}
      </div>
    </div>;

  const recordColumnClass = `col-${12/state.uiSettings.recordsPerRow}`;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <SearchFilters 
            {...{
              debug:false,
              query: state.query,
              setQuery: q => search(state.searchString, q(state.query)),
              searchResult: state.searchResult
            }}
          />
        </div>
        <div className="col-md-9">
          <ActiveFilters 
            query={state.query}
            clearQuery={() => search(state.searchString, {})}
            toggleQueryTerm={toggleQueryTerm} 
          />
          <div className="row">
            {state.searchResult.getPageOfRecords(state.pageNumber, 10).map(r => 
              <div className={recordColumnClass} key={r.id}>
                <pre>{JSON.stringify(r.paired_down_record,null,2)}</pre>
                <RecordTermTable
                  record={r.tags}
                  searchResult={state.searchResult}
                  onClick={toggleQueryTerm}
                  className={''}
                />
              </div>
            )}
          </div>
          {uiOptions}
        </div>
      </div>
    </div>
  );
}

export default Search;