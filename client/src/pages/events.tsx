import React, { useCallback } from "react";
import { graphql, PageProps } from "gatsby";
import styled from "styled-components";
import isFuture from "date-fns/isFuture";
import formatDate from "../helpers/format-date";
import Layout from "../components/layout";
import Seo from "../components/seo";
import EventPreview from "../components/event-preview";
import { DeepRequired } from "../helpers/deep-required";
import getEventPath from "../helpers/get-event-path";
import { IMAGE_MAX_WIDTH_PX } from "../theme";
import { colours } from "../theme";
import PortableText from "../components/portable-text";
import LocationTag from "../components/Location";

const EventsMain =styled.main`
  position:fixed;
  overflow-y:scroll;
  height:100%;
  right:0px;
  left:0px;
`;

const Introduction = styled.div`
max-width: ${IMAGE_MAX_WIDTH_PX}px;
  width: 100%;
  margin: 0 auto;
  padding-bottom:5rem;
  padding-left: 5rem;
  padding-right: 5rem;
  @media screen and (max-width: 440px) {
    padding-left:0px;
    padding-right:0px;
  }
  `;

const EventPreviews = styled.ul`
  max-width: ${IMAGE_MAX_WIDTH_PX}px;
  width: 100%;
  padding-left: 5rem;
  padding-right: 5rem;
  padding-bottom:400px;
  @media screen and (max-width: 440px) {
    padding-left:0px;
    padding-right:0px;
  }
`;

const EventPreviewsRow = styled.div`
  /* display: flex;
  flex-wrap: wrap;
  border-radius: 25px;
  @media screen and (min-width: 800px) {
  margin-left: 6rem;
  margin-right: 6rem; */
  background-color:#F5F5F5;
  border-radius:5px;
  padding:10px;
  margin:10px;
  margin-bottom:10px;
  
}
  
`;

const PublishedAt = styled.p`
  font-size: 0.9rem;
  border-bottom:solid black 2px;
  border-top:solid black;
  position:sticky;
  top:0px;
  background-color:white;
  margin-left:10px;
  margin-right:10px;
  //background-color: ${colours.backgroundGrey};
  
  /* display: flex;
  flex-wrap: wrap;
  @media screen and (min-width: 800px) {
  margin-left: 6rem;
  margin-right: 6rem;
} */
  margin-top:15px;
`;

export const query = graphql`
  query EventsPage {
    allSiteSettings: allSanitySiteSettings {
      edges {
        node {
          title
          description
          keywords
        }
      }
    }
    events: allSanityEvent(
      sort: { fields: [publishedAt], order: ASC }
      filter: { slug: { current: { ne: null } }, publishedAt: { ne: null } }
    ) {
      edges {
        node {
          id
          title
          subtitle
          publishedAt
          _rawLink(resolveReferences: { maxDepth: 5 })
          location{
      lat
      lng
      alt
      _key
      _type
    }
          eventOrganiser{
      _id
      name
    }
          
          # _rawExcerpt
          slug {
            current
          }
        }
      }
    }
  }
`;

type EventNode = DeepRequired<
  GatsbyTypes.EventsPageQuery["events"]["edges"][0]["node"],
  ["id"] | ["title"] | ["slug"] | ["subtitle"] |["eventOrganiser"]|["_rawLink"] |["Location"] | ["publishedAt"]
>;

type SiteSettingsNode = DeepRequired<
  GatsbyTypes.EventsPageQuery["allSiteSettings"]["edges"][0]["node"],
  ["title"] | ["description"] | ["keywords"]
>;
type EventsPageProps = PageProps<
  {
    allSiteSettings: { edges: { node: SiteSettingsNode }[] };
  } & {
    events: { edges: { node: EventNode }[] };
  },
  GatsbyTypes.SitePageContext
>;

const EventsPage: React.FC<EventsPageProps> = props => {
  console.log(props)
  let { allSiteSettings, events } = props.data;
  let { edges: eventEdges = [] } = events;
  const [siteSettingsEdge] = allSiteSettings.edges;


// fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=51.46327590000001,-0.1199887&key=AIzaSyDr2MOTyBtCxIjhkAMJSfa-KwN6eBrkEhI')
// .then(res => res.json()).then(data => console.log(data));

  if (!siteSettingsEdge) {
    console.error(
      'Missing "Site settings". Open the CMS and add some content to "Site settings".'
    );
  }

  
  const siteMeta = siteSettingsEdge ? siteSettingsEdge.node : {};

  const rows = eventEdges
    .filter(edge => isFuture(new Date(edge.node.publishedAt)))
    .map(row=>{
    row.day = formatDate(row.node.publishedAt)?.toString()
return row})
    .reduce((result, currentValue) => {

    (result[currentValue['day']] = result[currentValue['day']] || []).push(
      currentValue
    );
    return result;
  }, {})


  const eventPreviewProps = useCallback(
    (node: EventNode) => ({
      key: `events__EventPreview__event:${node.id}`,
      title: node.title,
      subtitle: node.subtitle,
      eventOrganiser:node.eventOrganiser,
      link:node._rawLink,
      Location:node.Location,
      publishedAt: node.publishedAt,
      //path: getEventPath(node),
    }),
    []
  );

console.log(rows);
console.log(typeof  Object.keys(rows)[0])
  return (
    
    <Layout>
      <EventsMain>
      <Seo
      title="Calendar"/>
      {/* description={site.description}
      keywords={site.keywords} */}
      
      {/* <Container> */}
      {/* <Introduction>
         <h1>Welcome to {siteMeta.title}</h1> 
      <p>This page has links to meetings and events.</p></Introduction> */}
      
      <EventPreviews>
        
        {Object.values(rows).map((row,index) => {
          console.log(row);
          return (<div>
            <PublishedAt>{Object.keys(rows)[index]}</PublishedAt>
          {row.map(event=>{
          return (
                
                <EventPreviewsRow key={`events__EventPreview__event:${row.node}`}>
                  <EventPreview {...eventPreviewProps(event.node)} variant="full" />
                  {/* <LocationTag lat={event?.node?.location?.lat} lng={event?.node?.location?.lng}/> */}
                  <PortableText blocks={event.node._rawLink}/>
                </EventPreviewsRow>
                
                
              );})}
              </div>);
              
            })}
      </EventPreviews>

      {/* </Container> */}
    </EventsMain>
    </Layout>
    
  );
};

export default EventsPage;

// calendar yes
// event organiser yes 
// location online/offline 
// link yes 
// like button yes 
//