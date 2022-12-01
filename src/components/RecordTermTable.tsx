import React from "react";
import { FieldValue, RecordValue, SearchResult } from "../model";

const RecordTermTable = ({
    record,
    onClick,
    searchResult,
    thWidth,
    className
} : {
    record: RecordValue;
    onClick?: undefined | ((facetName: string, term: string) => void);
    searchResult: SearchResult,
    thWidth?: string | undefined;
    className: string;
}) =>
    <table className={"table table-bordered " + (className || "")}>
        <tbody>
            {searchResult.facetIds.map(f => {
                let terms: FieldValue[] = 
                    !(f in record) 
                    ? ([] as FieldValue[]) 
                    : Array.isArray(record[f]) 
                    ? (record[f] as unknown as FieldValue[])
                    : [record[f]];
                return (
                    <tr key={f}>
                        <th style={{width: !thWidth ? "" : thWidth}}>
                            {f}
                        </th>
                        <td>
                            {terms.map(t => 
                                <span key={t}
                                    className={"badge me-2 " + (searchResult.termIsSelected(f,t.toString()) ? "bg-secondary" : "bg-light text-dark")}
                                    style={{border:'1px solid #ddd', cursor: !onClick ? 'default' : 'pointer'}}
                                    onClick={!onClick ? () => {} : () => onClick(f,t.toString())}
                                >
                                    {t}
                                    {!!searchResult.facetTermCount && <> ({searchResult.facetTermCount(f,t.toString())})</>}
                                </span>
                            )}
                        </td>
                    </tr>
                );
            })}
        </tbody>
    </table>;

export default RecordTermTable;