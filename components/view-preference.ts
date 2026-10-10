'use client';
import {useEffect,useRef,useState,type Dispatch,type SetStateAction} from 'react';
// Device-session UI preferences only. Data and permissions always come from the API.
export function useViewPreference<T>(key:string,initial:T):[T,Dispatch<SetStateAction<T>>]{
 const [value,setValue]=useState(initial),restored=useRef('');
 useEffect(()=>{try{const raw=sessionStorage.getItem(key);if(raw!==null)setValue(JSON.parse(raw))}catch{}restored.current=key},[key]);
 const update:Dispatch<SetStateAction<T>>=next=>setValue(previous=>{const v=typeof next==='function'?(next as (p:T)=>T)(previous):next;if(restored.current===key)try{sessionStorage.setItem(key,JSON.stringify(v))}catch{}return v});
 return [value,update];
}
