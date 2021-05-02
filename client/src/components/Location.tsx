import React from "React";
import useQuery from "react-query";
import styled from "styled-components";

interface LocationProps {
    lat: number;
    lng:number;
}

const LocationTag: React.FC<LocationProps> = props =>{
    const {data} = useQuery('location',fetchAddress);
    const API_key = "AIzaSyDr2MOTyBtCxIjhkAMJSfa-KwN6eBrkEhI";
    const {lng, lat} = props;

    
async function fetchAddress(){
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_key}`);
    const data = await res.json();
    console.log(data);
    return data;
}

console.log(data);




    
    return (<p>address</p>)

}

export default LocationTag;