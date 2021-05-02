// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// We import document schemas
import siteSettings from "./documents/siteSettings";
import category from "./documents/category";
import post from "./documents/post";
import author from "./documents/author";
import eventOrganiser from "./documents/eventOrganiser";
import about from "./documents/about";
import contact from "./documents/contact";
import menu from "./documents/menu";
import page from "./documents/page";

// We import object schemas
import blockContent from "./objects/blockContent";
import twitter from "./objects/twitter";
import youtube from "./objects/youtube";
import googleDriveVideo from "./objects/googleDriveVideo";
import event from "./documents/event";
import blockContentEvents from "./objects/blockContentEvents";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // The following are document types which will appear
    // in the studio.
    siteSettings,
    post,
    author,
    eventOrganiser,
    category,
    menu,
    page,
    event,
    // When added to this list, object types can be used as
    // { type: 'typename' } in other document schemas
    blockContent,
    blockContentEvents,
    about,
    contact,
    twitter,
    youtube,
    googleDriveVideo,
  ]),
});
