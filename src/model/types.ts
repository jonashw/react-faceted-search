export type FieldValue = string | number;
export type RecordValue = { [key: string]: FieldValue };
export type Field = {
	name: string;
	values: Set<FieldValue>;
}
export type SelectedFieldNames = 
{
	display: Set<string>;
	facet: Set<string>;
}
export type RecordsMetadata = {
	fields: Field[];
	fieldNames: string[];
	valuesByFieldName: {[fieldName:string]: Set<FieldValue>} 
	recommended_selections: {
    display: Set<string>,
    facet: Set<string>
  }
}
export type RecordWithMetadata = {
  //TODO: reconcile with RecordsMetadata type
  id: number;
  tags: RecordValue;
  paired_down_record: RecordValue;
  original_record: RecordValue;
  searchable_text: string[];
}

export type ChildParentRelations = {[childTerm: FieldValue]: FieldValue};
export type TaxonomyNode = {name:string, children: TaxonomyNode[]};
export type Taxonomy = TaxonomyNode[];
export type FacetTermParents = {[facet_id: string]: {[term: string]: string}};
export type FacetTermRecordIndex = {[facetId: string]: {[term: string]: Set<number>}};

export type FacetedIndexConfig = {
  fields: SelectedFieldNames,
  //The extra level of nesting is just-in-case 2+ facets share a term name
  facet_term_parents: FacetTermParents
}
export type Query = {[facetId: string] : string[]};
export type QuerySetter = (fn: (q: Query) => Query) => void;

export type TextIndex = {
  text: string;
  record_id: number;
}[];

export type FacetedIndexInstance = {
  text_index: TextIndex,
  search: (query: Query, seachKeyWord?: string | undefined) => SearchResult,
  actual_facet_fields: string[],
  display_fields: Set<string>, 
  candidate_facet_fields: Set<string>, 
  data: any,
  terms: any,
  taxonomy: Taxonomy
};
export type FacetTermBucket = {facet_id: string, term_buckets: TermBucket[]};
export type FacetHierarchicalTermBucket = {
  facet_id: string,
  term_buckets: HierarchicalTermBucket[]
}
export type TermBucket = {
  term: string,
  in_query: boolean,
  count: number,
  facet_id: string
};

export type HierarchicalTermBucket = {
  term: string,
  children: HierarchicalTermBucket[],
  in_query: boolean,
  count: number,
  facet_id: string
};

export type RecordCounts = {
  total: number;
  filtered: number;
}

export type SearchResult = {
  query: Query,
  facets: FacetTermBucket[],
  facetIds: string[],
  facetHierarchies: FacetHierarchicalTermBucket[],
  terms: TermBucket[],
  term_buckets_by_facet_id: {[facet_id: string]: {[term: string]: TermBucket}},
  facetTermCount: (facet: string, term: string) => number,
  records: RecordWithMetadata[],
  getPageOfRecords: (pageNumber: number, pageSize: number) => RecordWithMetadata[],
  recordCounts: RecordCounts,
  termIsSelected: (f: string, t: string) => boolean
}

export type UISettings = {
  horizontalSplit: string;
  recordsPerRow: number;
  pageSize: number;
}
export type UISettingControl<T> = {
    label: string,
    options: T[]
    defaultOption: T
    fromUrl: (str: string) => T,
    key: string,
    getter: (s: UISettings) => T,
    setter: (s: UISettings, v: T) => UISettings
}

export type SearchState = {
  ix: FacetedIndexInstance;
  uiSettingControls: UISettingControl<number|string>[];
  searchResult: SearchResult,
  uiSettings: UISettings;
  query: Query;
  pageNumber: number,
	searchString: string;
}

export const uiSettingControls: UISettingControl<any>[] = [
  {
    label: 'Horizontal split',
    options: [[1,11], [2,10],[3,9],[4,8]],
    defaultOption: [3,9],
    fromUrl: (str: string) => str,
    key: 'horizontalSplit',
    getter: s => s.horizontalSplit,
    setter: (s,v) => ({...s, horizontalSplit: v})
  },
  {
    label: 'Records per row',
    options: [1, 2, 3, 4, 6],
    defaultOption: 2,
    fromUrl: str => parseInt(str),
    key: 'recordsPerRow',
    getter: s => s.recordsPerRow,
    setter: (s,v) => ({...s, recordsPerRow: v})
  },
  {
    label: "Results per page",
    options: [10, 20, 50, 100],
    defaultOption: 20,
    fromUrl: str => parseInt(str),
    key: 'pageSize',
    getter: s => s.pageSize,
    setter: (s,v) => ({...s, pageSize: v})
  }
];

export const defaultUiSettings =
  uiSettingControls.reduce(
    (s,c) => c.setter(s,c.defaultOption),
    {} as UISettings);