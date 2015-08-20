define({

   // The template for a folder
   folderTemplate: {
      node: {
         nodeRef: "{nodeRef}",
         properties: {
            "cm:modified": {
               iso8601: "{modified}"
            },
            "cm:creator": {
               firstName: "{creator.forename}",
               lastName: "{creator.surname}",
               displayName: "{creator.forename} {creator.surname}",
               userName: "{creator.username}"
            },
            "cm:created": {
               iso8601: "{created}"
            },
            "cm:name": "{title}",
            "cm:modifier": {
               firstName: "{modifier.forename}",
               lastName: "{modifier.surname}",
               displayName: "{modifier.forename} {modifier.surname}",
               userName: "{modifier.username}"
            }
         },
         type: "cm:folder",
         isContainer: true
      },
      version: "1.0",
      nodeRef: "{nodeRef}",
      fileName: "{title}",
      displayName: "{title}"
   },

   // The template for a node
   nodeTemplate: {
      node: {
         nodeRef: "{nodeRef}",
         properties: {
            "cm:modified": {
               iso8601: "{modified}"
            },
            "cm:creator": {
               firstName: "{creator.forename}",
               lastName: "{creator.surname}",
               displayName: "{creator.forename} {creator.surname}",
               userName: "{creator.username}"
            },
            "cm:created": {
               iso8601: "{created}"
            },
            "cm:name": "{title}.pdf",
            "cm:modifier": {
               firstName: "{modifier.forename}",
               lastName: "{modifier.surname}",
               displayName: "{modifier.forename} {modifier.surname}",
               userName: "{modifier.username}"
            }
         },
         type: "cm:content",
         size: 1337,
         mimetypeDisplayName: "Adobe PDF Document",
         mimetype: "application\/pdf",
         encoding: "UTF-8",
         isContainer: false
      },
      version: "1.0",
      nodeRef: "{nodeRef}",
      fileName: "{title}.pdf",
      displayName: "{title}.pdf"
   },

   // The items to use as seed data for the above templates
   items: [{
      title: "Monthly HES Summary Data",
      nodeRef: "workspace:\/\/SpacesStore\/0ca6baf8-599b-4b72-9e22-6e761fac54cb",
      creator: {
         forename: "Phyllis",
         surname: "Black",
         username: "pblack"
      },
      created: "2014-05-04T21:49:37.000Z",
      modifier: {
         forename: "Phyllis",
         surname: "Garcia",
         username: "pgarcia"
      },
      modified: "2015-02-08T07:37:29.000Z"
   }, {
      title: "Telford and Wrekin Council",
      nodeRef: "workspace:\/\/SpacesStore\/b7ccaf97-b3ec-4481-b119-934337e3a0ec",
      creator: {
         forename: "Jane",
         surname: "Stewart",
         username: "jstewart"
      },
      created: "2013-11-19T02:29:03.000Z",
      modifier: {
         forename: "Anna",
         surname: "Gordon",
         username: "agordon"
      },
      modified: "2015-06-15T03:11:37.000Z"
   }, {
      title: "HCA Statistical data return",
      nodeRef: "workspace:\/\/SpacesStore\/a01a9e15-d6bc-4868-bbba-cdbba5f19064",
      creator: {
         forename: "Amanda",
         surname: "Greene",
         username: "agreene"
      },
      created: "2013-12-15T03:12:14.000Z",
      modifier: {
         forename: "Benjamin",
         surname: "Dixon",
         username: "bdixon"
      },
      modified: "2015-07-03T04:16:07.000Z"
   }, {
      title: "Central TLB",
      nodeRef: "workspace:\/\/SpacesStore\/d040aa05-ad54-495f-bf4e-3266b96391e9",
      creator: {
         forename: "Raymond",
         surname: "Warren",
         username: "rwarren"
      },
      created: "2014-06-27T14:55:10.000Z",
      modifier: {
         forename: "Justin",
         surname: "Romero",
         username: "jromero"
      },
      modified: "2015-08-05T04:15:34.000Z"
   }, {
      title: "Fraud",
      nodeRef: "workspace:\/\/SpacesStore\/ee0461e1-daa0-4efc-a142-3f709452fa0b",
      creator: {
         forename: "Angela",
         surname: "Lawrence",
         username: "alawrence"
      },
      created: "2014-04-11T16:10:40.000Z",
      modifier: {
         forename: "Roger",
         surname: "Fisher",
         username: "rfisher"
      },
      modified: "2014-08-25T05:28:16.000Z"
   }, {
      title: "Latest CSV dump",
      nodeRef: "workspace:\/\/SpacesStore\/778279fa-2aa7-4e45-a2f7-edf89ad39780",
      creator: {
         forename: "Kenneth",
         surname: "Gardner",
         username: "kgardner"
      },
      created: "2014-01-28T02:48:38.000Z",
      modifier: {
         forename: "Jessica",
         surname: "Patterson",
         username: "jpatterson"
      },
      modified: "2015-03-10T08:51:33.000Z"
   }, {
      title: "April return",
      nodeRef: "workspace:\/\/SpacesStore\/25dad0af-c378-4a42-9636-711180631821",
      creator: {
         forename: "Timothy",
         surname: "Bishop",
         username: "tbishop"
      },
      created: "2014-03-13T19:12:22.000Z",
      modifier: {
         forename: "Larry",
         surname: "Rice",
         username: "lrice"
      },
      modified: "2015-05-15T07:21:53.000Z"
   }, {
      title: "Temporary event notices",
      nodeRef: "workspace:\/\/SpacesStore\/a8d2eb8b-dba3-438b-b24b-69a25be698ba",
      creator: {
         forename: "Lisa",
         surname: "Wood",
         username: "lwood"
      },
      created: "2014-05-27T12:51:35.000Z",
      modifier: {
         forename: "Christine",
         surname: "Allen",
         username: "callen"
      },
      modified: "2014-11-06T05:02:12.000Z"
   }, {
      title: "Staff in post",
      nodeRef: "workspace:\/\/SpacesStore\/346ea659-f095-4f17-9574-c3ef574a903d",
      creator: {
         forename: "Helen",
         surname: "Castillo",
         username: "hcastillo"
      },
      created: "2013-09-24T08:40:23.000Z",
      modifier: {
         forename: "Philip",
         surname: "Graham",
         username: "pgraham"
      },
      modified: "2015-07-22T06:02:13.000Z"
   }, {
      title: "Offences against the person",
      nodeRef: "workspace:\/\/SpacesStore\/3e41127d-5df3-4f79-b6a1-ac257d3354d4",
      creator: {
         forename: "Adam",
         surname: "Roberts",
         username: "aroberts"
      },
      created: "2013-09-04T09:56:13.000Z",
      modifier: {
         forename: "Gregory",
         surname: "Hall",
         username: "ghall"
      },
      modified: "2015-08-01T10:22:03.000Z"
   }, {
      title: "Schema Definition",
      nodeRef: "workspace:\/\/SpacesStore\/7a48da0a-f85d-427a-ac4a-91ff2eff3816",
      creator: {
         forename: "Juan",
         surname: "Fields",
         username: "jfields"
      },
      created: "2014-06-07T05:24:46.000Z",
      modifier: {
         forename: "Martha",
         surname: "Hughes",
         username: "mhughes"
      },
      modified: "2015-07-13T03:29:14.000Z"
   }, {
      title: "RCOG HMB website",
      nodeRef: "workspace:\/\/SpacesStore\/a03a4d2e-f06c-4d11-8585-fa39e8afe5b8",
      creator: {
         forename: "Kathleen",
         surname: "Alexander",
         username: "kalexander"
      },
      created: "2013-12-20T02:16:56.000Z",
      modifier: {
         forename: "Katherine",
         surname: "Hanson",
         username: "khanson"
      },
      modified: "2015-06-03T18:42:22.000Z"
   }, {
      title: "Qualification Type Success Rates",
      nodeRef: "workspace:\/\/SpacesStore\/0a0d6195-d379-4f98-b61e-7dbabcbbefb2",
      creator: {
         forename: "Dorothy",
         surname: "Williams",
         username: "dwilliams"
      },
      created: "2013-09-22T12:07:05.000Z",
      modifier: {
         forename: "Bonnie",
         surname: "Day",
         username: "bday"
      },
      modified: "2015-01-08T18:05:59.000Z"
   }, {
      title: "Advertising hoarding sites",
      nodeRef: "workspace:\/\/SpacesStore\/aa6f1d05-f948-4e27-81db-610c19dcb9ee",
      creator: {
         forename: "Carol",
         surname: "Austin",
         username: "caustin"
      },
      created: "2013-11-30T20:12:34.000Z",
      modifier: {
         forename: "Dorothy",
         surname: "Stephens",
         username: "dstephens"
      },
      modified: "2015-03-22T08:46:09.000Z"
   }, {
      title: "Car Park Data",
      nodeRef: "workspace:\/\/SpacesStore\/27fc5199-3afb-43b5-916b-8690bee9a081",
      creator: {
         forename: "Justin",
         surname: "Howard",
         username: "jhoward"
      },
      created: "2014-03-01T22:35:38.000Z",
      modifier: {
         forename: "Henry",
         surname: "Wallace",
         username: "hwallace"
      },
      modified: "2015-04-02T00:50:22.000Z"
   }, {
      title: "October QDS data",
      nodeRef: "workspace:\/\/SpacesStore\/a91bf94c-a9fe-4f19-98f5-b1d4fdbc9089",
      creator: {
         forename: "Jonathan",
         surname: "Phillips",
         username: "jphillips"
      },
      created: "2013-12-03T15:00:32.000Z",
      modifier: {
         forename: "Catherine",
         surname: "Gutierrez",
         username: "cgutierrez"
      },
      modified: "2015-02-11T14:28:47.000Z"
   }, {
      title: "SCS pay",
      nodeRef: "workspace:\/\/SpacesStore\/01d84074-72ad-419f-b1a7-cff702408d6d",
      creator: {
         forename: "Teresa",
         surname: "Gibson",
         username: "tgibson"
      },
      created: "2013-10-03T07:20:00.000Z",
      modifier: {
         forename: "Alice",
         surname: "White",
         username: "awhite"
      },
      modified: "2015-05-10T18:53:05.000Z"
   }, {
      title: "Amber Valley",
      nodeRef: "workspace:\/\/SpacesStore\/9b424add-28d2-4fba-a45c-b54d2a032f5f",
      creator: {
         forename: "Steven",
         surname: "Brown",
         username: "sbrown"
      },
      created: "2013-09-25T21:18:18.000Z",
      modifier: {
         forename: "Scott",
         surname: "Daniels",
         username: "sdaniels"
      },
      modified: "2015-04-16T17:47:57.000Z"
   }, {
      title: "Extraction Tool",
      nodeRef: "workspace:\/\/SpacesStore\/5f6e7d80-6d1c-49ef-8be5-0fab2a9c3991",
      creator: {
         forename: "Sara",
         surname: "Johnston",
         username: "sjohnston"
      },
      created: "2014-04-30T12:44:09.000Z",
      modifier: {
         forename: "Alan",
         surname: "Black",
         username: "ablack"
      },
      modified: "2014-10-25T15:04:48.000Z"
   }, {
      title: "Excluded Qualifications",
      nodeRef: "workspace:\/\/SpacesStore\/d33d34c0-92e5-4160-bf1f-d20146f4d6d9",
      creator: {
         forename: "Karen",
         surname: "Anderson",
         username: "kanderson"
      },
      created: "2014-01-02T00:49:55.000Z",
      modifier: {
         forename: "Melissa",
         surname: "Stephens",
         username: "mstephens"
      },
      modified: "2014-12-02T23:44:04.000Z"
   }, {
      title: "Cycle area list",
      nodeRef: "workspace:\/\/SpacesStore\/97516800-9a18-4017-b1fb-1defee586eb9",
      creator: {
         forename: "Philip",
         surname: "Mendoza",
         username: "pmendoza"
      },
      created: "2014-07-19T16:08:49.000Z",
      modifier: {
         forename: "Joseph",
         surname: "Dixon",
         username: "jdixon"
      },
      modified: "2015-06-16T18:17:32.000Z"
   }, {
      title: "Blaby Community Grants",
      nodeRef: "workspace:\/\/SpacesStore\/cc36eee3-130d-46bb-b3c0-ff1377637b95",
      creator: {
         forename: "Daniel",
         surname: "Dunn",
         username: "ddunn"
      },
      created: "2013-11-05T16:50:19.000Z",
      modifier: {
         forename: "Jeremy",
         surname: "Ross",
         username: "jross"
      },
      modified: "2015-02-20T06:18:57.000Z"
   }, {
      title: "Expenditure and Unit Costs",
      nodeRef: "workspace:\/\/SpacesStore\/b856559c-7c94-4994-be35-51f27e9f43c6",
      creator: {
         forename: "Wanda",
         surname: "Oliver",
         username: "woliver"
      },
      created: "2013-10-15T20:35:51.000Z",
      modifier: {
         forename: "Arthur",
         surname: "Young",
         username: "ayoung"
      },
      modified: "2014-08-27T20:04:02.000Z"
   }, {
      title: "Harrow Public Toilets",
      nodeRef: "workspace:\/\/SpacesStore\/bd1566a9-add6-4e85-addd-8c12468dffe8",
      creator: {
         forename: "Joe",
         surname: "Gibson",
         username: "jgibson"
      },
      created: "2014-07-20T19:10:19.000Z",
      modifier: {
         forename: "Charles",
         surname: "Fisher",
         username: "cfisher"
      },
      modified: "2014-09-30T16:32:40.000Z"
   }, {
      title: "Visa nationals unsuccessful applicants",
      nodeRef: "workspace:\/\/SpacesStore\/4b14964d-812e-4a4b-829a-f30afb61fc20",
      creator: {
         forename: "Thomas",
         surname: "Richardson",
         username: "trichardson"
      },
      created: "2013-11-04T16:09:13.000Z",
      modifier: {
         forename: "Jack",
         surname: "Moore",
         username: "jmoore"
      },
      modified: "2014-09-10T18:14:14.000Z"
   }, {
      title: "DECC Live energy data",
      nodeRef: "workspace:\/\/SpacesStore\/8d53b689-db7c-412e-9316-505b5b8069a4",
      creator: {
         forename: "James",
         surname: "Lee",
         username: "jlee"
      },
      created: "2014-05-17T02:09:01.000Z",
      modifier: {
         forename: "Marilyn",
         surname: "Medina",
         username: "mmedina"
      },
      modified: "2014-12-15T14:33:38.000Z"
   }, {
      title: "Disaggregated Social Care Indicators",
      nodeRef: "workspace:\/\/SpacesStore\/aa55c00f-adec-4a36-ab1a-b119d351b9af",
      creator: {
         forename: "Johnny",
         surname: "James",
         username: "jjames"
      },
      created: "2014-02-12T03:08:16.000Z",
      modifier: {
         forename: "Frank",
         surname: "Reyes",
         username: "freyes"
      },
      modified: "2015-06-30T06:43:57.000Z"
   }, {
      title: "Administration Budgets",
      nodeRef: "workspace:\/\/SpacesStore\/037c19eb-0552-4132-8f40-842f6a6d56bb",
      creator: {
         forename: "Louis",
         surname: "Franklin",
         username: "lfranklin"
      },
      created: "2014-02-01T10:32:38.000Z",
      modifier: {
         forename: "Joan",
         surname: "Sanders",
         username: "jsanders"
      },
      modified: "2015-07-30T13:45:54.000Z"
   }, {
      title: "Object Sitter",
      nodeRef: "workspace:\/\/SpacesStore\/d6be809b-346e-4ba0-833e-2eececdccbb6",
      creator: {
         forename: "Shawn",
         surname: "Henry",
         username: "shenry"
      },
      created: "2014-07-31T09:36:25.000Z",
      modifier: {
         forename: "Rose",
         surname: "Mason",
         username: "rmason"
      },
      modified: "2014-12-29T02:36:36.000Z"
   }, {
      title: "Purchase Orders",
      nodeRef: "workspace:\/\/SpacesStore\/2064395f-588c-4c64-b3ce-50eb5720c056",
      creator: {
         forename: "Richard",
         surname: "Martinez",
         username: "rmartinez"
      },
      created: "2014-02-09T22:14:36.000Z",
      modifier: {
         forename: "Kenneth",
         surname: "Wagner",
         username: "kwagner"
      },
      modified: "2014-11-18T22:04:37.000Z"
   }, {
      title: "Abeyance and Dispersal GPs",
      nodeRef: "workspace:\/\/SpacesStore\/37833b97-cd8c-4edc-b6b9-40a8a84a0282",
      creator: {
         forename: "Wayne",
         surname: "Mendoza",
         username: "wmendoza"
      },
      created: "2013-10-21T20:40:23.000Z",
      modifier: {
         forename: "Scott",
         surname: "Jordan",
         username: "sjordan"
      },
      modified: "2014-12-23T04:54:04.000Z"
   }, {
      title: "Junior staff",
      nodeRef: "workspace:\/\/SpacesStore\/86f7cdc4-2818-4658-b139-7e6783d9dccf",
      creator: {
         forename: "Gerald",
         surname: "Smith",
         username: "gsmith"
      },
      created: "2013-09-28T13:32:35.000Z",
      modifier: {
         forename: "Gregory",
         surname: "Butler",
         username: "gbutler"
      },
      modified: "2015-03-09T08:32:56.000Z"
   }, {
      title: "Meetings with external media",
      nodeRef: "workspace:\/\/SpacesStore\/8694d47a-76f8-4c42-912e-f8b64c4cb2c1",
      creator: {
         forename: "Catherine",
         surname: "Carter",
         username: "ccarter"
      },
      created: "2014-05-02T09:10:10.000Z",
      modifier: {
         forename: "Evelyn",
         surname: "Fox",
         username: "efox"
      },
      modified: "2015-08-18T01:18:48.000Z"
   }, {
      title: "Leavers by gender",
      nodeRef: "workspace:\/\/SpacesStore\/e04b7e86-50bc-435a-82d5-f3672c746254",
      creator: {
         forename: "Michael",
         surname: "Crawford",
         username: "mcrawford"
      },
      created: "2014-08-03T03:30:08.000Z",
      modifier: {
         forename: "Irene",
         surname: "Ellis",
         username: "iellis"
      },
      modified: "2014-09-26T03:26:39.000Z"
   }, {
      title: "Dataset interest",
      nodeRef: "workspace:\/\/SpacesStore\/f964017d-9fb5-4284-8834-95381a3ec8a4",
      creator: {
         forename: "Marie",
         surname: "Romero",
         username: "mromero"
      },
      created: "2014-04-12T08:49:54.000Z",
      modifier: {
         forename: "Angela",
         surname: "Perez",
         username: "aperez"
      },
      modified: "2015-06-01T04:45:35.000Z"
   }, {
      title: "Forest of Dean",
      nodeRef: "workspace:\/\/SpacesStore\/bc462e0b-0fbf-4f49-8bee-a39c249d3c00",
      creator: {
         forename: "Evelyn",
         surname: "Porter",
         username: "eporter"
      },
      created: "2014-07-16T16:03:30.000Z",
      modifier: {
         forename: "Peter",
         surname: "Coleman",
         username: "pcoleman"
      },
      modified: "2014-12-21T02:12:33.000Z"
   }, {
      title: "Raw Data",
      nodeRef: "workspace:\/\/SpacesStore\/daa9763c-4a60-4f5e-a151-364c77892c3b",
      creator: {
         forename: "Jason",
         surname: "Fuller",
         username: "jfuller"
      },
      created: "2014-01-17T21:58:07.000Z",
      modifier: {
         forename: "Patrick",
         surname: "Hughes",
         username: "phughes"
      },
      modified: "2015-05-18T04:34:58.000Z"
   }, {
      title: "Transport Statistics OldhamMain Report",
      nodeRef: "workspace:\/\/SpacesStore\/54e737d4-1f0c-40d5-8e08-a3d2c042d026",
      creator: {
         forename: "Ruth",
         surname: "Cook",
         username: "rcook"
      },
      created: "2014-04-06T10:23:11.000Z",
      modifier: {
         forename: "Karen",
         surname: "Little",
         username: "klittle"
      },
      modified: "2014-11-29T02:46:58.000Z"
   }, {
      title: "Property routes",
      nodeRef: "workspace:\/\/SpacesStore\/88e083d4-5f97-4a43-8f91-c438c8a2b987",
      creator: {
         forename: "Timothy",
         surname: "Perkins",
         username: "tperkins"
      },
      created: "2013-12-28T14:01:00.000Z",
      modifier: {
         forename: "Jimmy",
         surname: "Gibson",
         username: "jgibson"
      },
      modified: "2014-10-30T01:30:40.000Z"
   }, {
      title: "CMR SCO data",
      nodeRef: "workspace:\/\/SpacesStore\/700080b6-15b7-4c43-beb7-e81f5c412160",
      creator: {
         forename: "Doris",
         surname: "Lopez",
         username: "dlopez"
      },
      created: "2013-09-29T17:53:49.000Z",
      modifier: {
         forename: "Jean",
         surname: "Ford",
         username: "jford"
      },
      modified: "2014-10-25T13:06:36.000Z"
   }, {
      title: "Car Parks User Guide",
      nodeRef: "workspace:\/\/SpacesStore\/a3ce70b7-af6e-49fb-b279-2363d2921bb9",
      creator: {
         forename: "Chris",
         surname: "Cunningham",
         username: "ccunningham"
      },
      created: "2013-09-06T01:23:54.000Z",
      modifier: {
         forename: "Edward",
         surname: "Elliott",
         username: "eelliott"
      },
      modified: "2014-12-08T15:42:40.000Z"
   }, {
      title: "RCP website",
      nodeRef: "workspace:\/\/SpacesStore\/dce11585-9f81-4f5a-826d-3454a72c18f4",
      creator: {
         forename: "Steve",
         surname: "Wells",
         username: "swells"
      },
      created: "2014-03-19T22:20:16.000Z",
      modifier: {
         forename: "Debra",
         surname: "Cruz",
         username: "dcruz"
      },
      modified: "2015-04-12T07:42:02.000Z"
   }, {
      title: "Pay Group and Structure",
      nodeRef: "workspace:\/\/SpacesStore\/9e1250a0-e562-4b4a-a8dc-7657b6082bf7",
      creator: {
         forename: "Martha",
         surname: "Gordon",
         username: "mgordon"
      },
      created: "2014-03-30T18:41:22.000Z",
      modifier: {
         forename: "Emily",
         surname: "Knight",
         username: "eknight"
      },
      modified: "2014-10-24T17:28:30.000Z"
   }, {
      title: "South Kesteven",
      nodeRef: "workspace:\/\/SpacesStore\/ce613fa0-e22c-42ed-9077-93fa3f3471a8",
      creator: {
         forename: "Evelyn",
         surname: "Lee",
         username: "elee"
      },
      created: "2014-05-06T12:22:23.000Z",
      modifier: {
         forename: "Raymond",
         surname: "Cox",
         username: "rcox"
      },
      modified: "2015-07-08T07:13:19.000Z"
   }, {
      title: "Roadside survey data guide",
      nodeRef: "workspace:\/\/SpacesStore\/9840a64e-36af-438b-a3be-7effbac59574",
      creator: {
         forename: "Kathryn",
         surname: "Alvarez",
         username: "kalvarez"
      },
      created: "2014-07-13T05:34:45.000Z",
      modifier: {
         forename: "Ralph",
         surname: "Nguyen",
         username: "rnguyen"
      },
      modified: "2015-03-25T15:37:52.000Z"
   }, {
      title: "Drugs offences",
      nodeRef: "workspace:\/\/SpacesStore\/52bfe6a0-e3c7-43cb-83bf-e6561072aa7c",
      creator: {
         forename: "Chris",
         surname: "Kelly",
         username: "ckelly"
      },
      created: "2014-06-15T00:23:34.000Z",
      modifier: {
         forename: "Ruby",
         surname: "Williams",
         username: "rwilliams"
      },
      modified: "2015-04-16T02:51:45.000Z"
   }, {
      title: "Council use of renewable energy",
      nodeRef: "workspace:\/\/SpacesStore\/b13f1819-f71e-474c-ad63-46f3e82317f9",
      creator: {
         forename: "Nicole",
         surname: "Gardner",
         username: "ngardner"
      },
      created: "2013-11-03T07:13:53.000Z",
      modifier: {
         forename: "Chris",
         surname: "Foster",
         username: "cfoster"
      },
      modified: "2014-09-28T17:22:10.000Z"
   }, {
      title: "Organogram visualisation",
      nodeRef: "workspace:\/\/SpacesStore\/b8563900-94e9-4ca2-baf3-e60a7e9d2361",
      creator: {
         forename: "Willie",
         surname: "Mcdonald",
         username: "wmcdonald"
      },
      created: "2014-06-27T19:57:11.000Z",
      modifier: {
         forename: "Earl",
         surname: "Martinez",
         username: "emartinez"
      },
      modified: "2015-02-25T20:28:23.000Z"
   }, {
      title: "Blaenau Gwent",
      nodeRef: "workspace:\/\/SpacesStore\/88e4b932-f3be-4429-b767-acb105ffef21",
      creator: {
         forename: "David",
         surname: "Murray",
         username: "dmurray"
      },
      created: "2014-08-17T02:54:47.000Z",
      modifier: {
         forename: "Clarence",
         surname: "Foster",
         username: "cfoster"
      },
      modified: "2015-03-18T04:06:40.000Z"
   }, {
      title: "Lottery Grants advanced search",
      nodeRef: "workspace:\/\/SpacesStore\/5f49bd1e-56ad-48d7-915c-dd6439361a25",
      creator: {
         forename: "Sandra",
         surname: "Schmidt",
         username: "sschmidt"
      },
      created: "2013-12-21T13:22:48.000Z",
      modifier: {
         forename: "Donna",
         surname: "Johnson",
         username: "djohnson"
      },
      modified: "2015-05-13T22:37:49.000Z"
   }, {
      title: "Car Park webpage",
      nodeRef: "workspace:\/\/SpacesStore\/40ac97d9-8882-4d94-b873-6fa9e6b628ab",
      creator: {
         forename: "Stephen",
         surname: "Wilson",
         username: "swilson"
      },
      created: "2014-06-24T06:26:44.000Z",
      modifier: {
         forename: "Christine",
         surname: "Adams",
         username: "cadams"
      },
      modified: "2015-05-31T14:13:27.000Z"
   }, {
      title: "North East Lincolnshire",
      nodeRef: "workspace:\/\/SpacesStore\/98a35eef-497f-41cc-929c-58dd9d5adfed",
      creator: {
         forename: "Brian",
         surname: "Brown",
         username: "bbrown"
      },
      created: "2014-02-18T09:12:43.000Z",
      modifier: {
         forename: "Lisa",
         surname: "Lee",
         username: "llee"
      },
      modified: "2015-07-23T06:52:11.000Z"
   }, {
      title: "Link coordinates",
      nodeRef: "workspace:\/\/SpacesStore\/52458ce6-0af8-4e43-b72b-615896a34ca9",
      creator: {
         forename: "Kathleen",
         surname: "Cooper",
         username: "kcooper"
      },
      created: "2014-05-18T03:34:32.000Z",
      modifier: {
         forename: "Rose",
         surname: "Hernandez",
         username: "rhernandez"
      },
      modified: "2014-11-13T22:00:40.000Z"
   }, {
      title: "External applicants by religion",
      nodeRef: "workspace:\/\/SpacesStore\/3252d773-a5e5-4227-b48e-971cf2f086b8",
      creator: {
         forename: "Annie",
         surname: "Daniels",
         username: "adaniels"
      },
      created: "2014-02-14T05:43:53.000Z",
      modifier: {
         forename: "Clarence",
         surname: "Gutierrez",
         username: "cgutierrez"
      },
      modified: "2015-06-08T04:25:07.000Z"
   }, {
      title: "Bus Stops in York",
      nodeRef: "workspace:\/\/SpacesStore\/b84ee9a5-64db-4f7c-aee2-63b3d38d0ac5",
      creator: {
         forename: "Jessica",
         surname: "Holmes",
         username: "jholmes"
      },
      created: "2014-07-17T13:16:09.000Z",
      modifier: {
         forename: "Peter",
         surname: "Pierce",
         username: "ppierce"
      },
      modified: "2015-02-28T09:10:00.000Z"
   }, {
      title: "Tameside main report",
      nodeRef: "workspace:\/\/SpacesStore\/a52d40e4-78d3-4529-ad0a-3535f91f4dee",
      creator: {
         forename: "Lisa",
         surname: "Hunter",
         username: "lhunter"
      },
      created: "2014-02-22T03:43:05.000Z",
      modifier: {
         forename: "Steve",
         surname: "Hughes",
         username: "shughes"
      },
      modified: "2015-04-01T00:00:27.000Z"
   }, {
      title: "Staff in post by gender",
      nodeRef: "workspace:\/\/SpacesStore\/16c3db13-a628-48a7-abdd-7113170c783d",
      creator: {
         forename: "Steven",
         surname: "Griffin",
         username: "sgriffin"
      },
      created: "2013-12-23T16:04:59.000Z",
      modifier: {
         forename: "Tammy",
         surname: "Grant",
         username: "tgrant"
      },
      modified: "2014-10-16T16:06:19.000Z"
   }, {
      title: "NHS Continuing Healthcare Activity",
      nodeRef: "workspace:\/\/SpacesStore\/1f946afd-0e8b-4f12-9e81-3f85580a86c7",
      creator: {
         forename: "Matthew",
         surname: "Gordon",
         username: "mgordon"
      },
      created: "2013-12-24T02:27:50.000Z",
      modifier: {
         forename: "Steven",
         surname: "Cooper",
         username: "scooper"
      },
      modified: "2015-01-02T04:32:32.000Z"
   }, {
      title: "Sevenoaks District Polling District Boundaries",
      nodeRef: "workspace:\/\/SpacesStore\/b936035e-e525-49fe-99af-dbeb841f4fc0",
      creator: {
         forename: "Sara",
         surname: "Morrison",
         username: "smorrison"
      },
      created: "2014-03-21T20:41:27.000Z",
      modifier: {
         forename: "Catherine",
         surname: "Simpson",
         username: "csimpson"
      },
      modified: "2015-07-18T10:05:19.000Z"
   }, {
      title: "Public perceptions of crime",
      nodeRef: "workspace:\/\/SpacesStore\/8a096e37-913f-4efc-867e-d25d17f1ca97",
      creator: {
         forename: "Mark",
         surname: "Garza",
         username: "mgarza"
      },
      created: "2014-06-16T09:44:02.000Z",
      modifier: {
         forename: "Linda",
         surname: "Perkins",
         username: "lperkins"
      },
      modified: "2015-01-16T03:29:38.000Z"
   }, {
      title: "Senior roles",
      nodeRef: "workspace:\/\/SpacesStore\/baa667bd-51be-497e-9197-f89ff390b50e",
      creator: {
         forename: "Keith",
         surname: "Henderson",
         username: "khenderson"
      },
      created: "2014-03-20T05:52:41.000Z",
      modifier: {
         forename: "Keith",
         surname: "Willis",
         username: "kwillis"
      },
      modified: "2014-10-06T06:45:54.000Z"
   }, {
      title: "Statement of parliamentary Supply",
      nodeRef: "workspace:\/\/SpacesStore\/7905ac7e-d2e8-4306-b5fb-6c5e2b133e82",
      creator: {
         forename: "Stephen",
         surname: "Ortiz",
         username: "sortiz"
      },
      created: "2014-05-13T19:49:55.000Z",
      modifier: {
         forename: "Eugene",
         surname: "Crawford",
         username: "ecrawford"
      },
      modified: "2014-09-16T01:03:32.000Z"
   }, {
      title: "Local Guidance",
      nodeRef: "workspace:\/\/SpacesStore\/7aa77221-5a76-4fb7-b54c-f3276ab2ea53",
      creator: {
         forename: "Betty",
         surname: "Dixon",
         username: "bdixon"
      },
      created: "2013-12-25T20:40:53.000Z",
      modifier: {
         forename: "Gregory",
         surname: "Anderson",
         username: "ganderson"
      },
      modified: "2014-10-19T17:28:58.000Z"
   }, {
      title: "Revaluation Reserve",
      nodeRef: "workspace:\/\/SpacesStore\/6b6f8009-c976-445e-964e-8ae5ed1c27d4",
      creator: {
         forename: "Ann",
         surname: "Richardson",
         username: "arichardson"
      },
      created: "2014-06-12T14:47:02.000Z",
      modifier: {
         forename: "Thomas",
         surname: "Alvarez",
         username: "talvarez"
      },
      modified: "2015-05-04T22:18:50.000Z"
   }, {
      title: "Transaction Linked Data API",
      nodeRef: "workspace:\/\/SpacesStore\/d66058f5-f8a2-4fc8-b59c-43298bef42a7",
      creator: {
         forename: "Anna",
         surname: "Oliver",
         username: "aoliver"
      },
      created: "2013-12-23T11:15:53.000Z",
      modifier: {
         forename: "Sean",
         surname: "Rivera",
         username: "srivera"
      },
      modified: "2015-06-24T02:54:38.000Z"
   }, {
      title: "British Retail Consortium Calendar",
      nodeRef: "workspace:\/\/SpacesStore\/923b80da-4e6a-425a-9f98-e478fdf2a95d",
      creator: {
         forename: "Rebecca",
         surname: "Marshall",
         username: "rmarshall"
      },
      created: "2014-03-22T04:40:10.000Z",
      modifier: {
         forename: "Shirley",
         surname: "Frazier",
         username: "sfrazier"
      },
      modified: "2014-12-15T05:51:06.000Z"
   }, {
      title: "SSNAP Clinical Audit Webpage",
      nodeRef: "workspace:\/\/SpacesStore\/a827b513-ff2d-413d-9773-d8078fb6aca9",
      creator: {
         forename: "Carl",
         surname: "Chavez",
         username: "cchavez"
      },
      created: "2014-02-19T04:08:47.000Z",
      modifier: {
         forename: "Julie",
         surname: "Howell",
         username: "jhowell"
      },
      modified: "2015-02-18T02:20:34.000Z"
   }, {
      title: "HSCIC Prescribing",
      nodeRef: "workspace:\/\/SpacesStore\/516c4c9a-6931-4837-898d-7392a4b0eaa5",
      creator: {
         forename: "Jessica",
         surname: "Nichols",
         username: "jnichols"
      },
      created: "2014-04-15T02:13:39.000Z",
      modifier: {
         forename: "Shawn",
         surname: "Romero",
         username: "sromero"
      },
      modified: "2015-05-08T02:33:05.000Z"
   }, {
      title: "QOF Exception Report",
      nodeRef: "workspace:\/\/SpacesStore\/e503d8bf-4b64-4788-a6ff-1222ec96dca5",
      creator: {
         forename: "Eric",
         surname: "Fowler",
         username: "efowler"
      },
      created: "2014-05-22T01:08:20.000Z",
      modifier: {
         forename: "Rose",
         surname: "Smith",
         username: "rsmith"
      },
      modified: "2014-12-29T00:06:49.000Z"
   }, {
      title: "Premises Licences West Norfolk",
      nodeRef: "workspace:\/\/SpacesStore\/dac8db6d-b9fc-4cf6-ae6b-f9a7a593a6a6",
      creator: {
         forename: "Wayne",
         surname: "Reid",
         username: "wreid"
      },
      created: "2014-03-01T00:28:59.000Z",
      modifier: {
         forename: "Scott",
         surname: "Sanchez",
         username: "ssanchez"
      },
      modified: "2014-09-11T06:52:45.000Z"
   }, {
      title: "NFDC Planning",
      nodeRef: "workspace:\/\/SpacesStore\/b7e9ec08-7c4e-4a75-a542-49e35c7da83a",
      creator: {
         forename: "Larry",
         surname: "Thompson",
         username: "lthompson"
      },
      created: "2014-07-11T01:28:46.000Z",
      modifier: {
         forename: "Maria",
         surname: "Ellis",
         username: "mellis"
      },
      modified: "2014-12-18T04:49:12.000Z"
   }, {
      title: "Treatment Centres",
      nodeRef: "workspace:\/\/SpacesStore\/7dd2d525-7031-4bc0-a3dd-93d55072b045",
      creator: {
         forename: "Susan",
         surname: "Howell",
         username: "showell"
      },
      created: "2014-08-13T02:10:04.000Z",
      modifier: {
         forename: "Nicholas",
         surname: "Romero",
         username: "nromero"
      },
      modified: "2014-11-01T18:24:43.000Z"
   }, {
      title: "CTLB Senior staff dataset",
      nodeRef: "workspace:\/\/SpacesStore\/03b30b13-042f-438b-ac2a-c676c0032774",
      creator: {
         forename: "Gerald",
         surname: "Burns",
         username: "gburns"
      },
      created: "2014-06-09T05:54:03.000Z",
      modifier: {
         forename: "Norma",
         surname: "Diaz",
         username: "ndiaz"
      },
      modified: "2014-10-04T08:13:04.000Z"
   }, {
      title: "Senior staff pay",
      nodeRef: "workspace:\/\/SpacesStore\/5691475b-c32a-4dca-a255-acd9cf320576",
      creator: {
         forename: "Carolyn",
         surname: "Hunt",
         username: "chunt"
      },
      created: "2014-07-16T03:26:31.000Z",
      modifier: {
         forename: "Jeremy",
         surname: "Hall",
         username: "jhall"
      },
      modified: "2015-07-02T18:21:25.000Z"
   }, {
      title: "The National Pain Audit Organisational Data File",
      nodeRef: "workspace:\/\/SpacesStore\/48829bb1-0c41-40c2-abe1-c910c346dbe5",
      creator: {
         forename: "Alan",
         surname: "Hernandez",
         username: "ahernandez"
      },
      created: "2013-10-13T20:57:50.000Z",
      modifier: {
         forename: "Andrew",
         surname: "Castillo",
         username: "acastillo"
      },
      modified: "2014-11-20T10:16:00.000Z"
   }, {
      title: "Number of applications in England and Wales divided by local authority district",
      nodeRef: "workspace:\/\/SpacesStore\/0994da40-3822-43a2-8a58-b262080b2952",
      creator: {
         forename: "Ashley",
         surname: "Nelson",
         username: "anelson"
      },
      created: "2014-04-09T01:21:43.000Z",
      modifier: {
         forename: "Anthony",
         surname: "Black",
         username: "ablack"
      },
      modified: "2015-07-23T18:07:01.000Z"
   }, {
      title: "Care Trusts and Sites",
      nodeRef: "workspace:\/\/SpacesStore\/1193bc2c-3da5-439b-877b-350b9ac7b4a2",
      creator: {
         forename: "Ernest",
         surname: "Gutierrez",
         username: "egutierrez"
      },
      created: "2013-12-11T14:57:44.000Z",
      modifier: {
         forename: "Frank",
         surname: "Medina",
         username: "fmedina"
      },
      modified: "2015-03-02T15:51:56.000Z"
   }, {
      title: "Thames Valley",
      nodeRef: "workspace:\/\/SpacesStore\/ae611eab-320f-45b2-b4ff-4f8bec9bd334",
      creator: {
         forename: "Andrew",
         surname: "Ford",
         username: "aford"
      },
      created: "2014-02-24T20:36:19.000Z",
      modifier: {
         forename: "Michelle",
         surname: "Jordan",
         username: "mjordan"
      },
      modified: "2015-08-06T09:59:23.000Z"
   }, {
      title: "Stockport Property Addresses",
      nodeRef: "workspace:\/\/SpacesStore\/677a4ab2-d276-4bfb-b115-1306550a2e18",
      creator: {
         forename: "Kelly",
         surname: "Ellis",
         username: "kellis"
      },
      created: "2013-11-24T10:40:50.000Z",
      modifier: {
         forename: "Joyce",
         surname: "Austin",
         username: "jaustin"
      },
      modified: "2014-12-22T10:35:48.000Z"
   }, {
      title: "CMR NI post data",
      nodeRef: "workspace:\/\/SpacesStore\/784ce961-c789-4dd7-af06-3b56e48eaa46",
      creator: {
         forename: "Timothy",
         surname: "Mendoza",
         username: "tmendoza"
      },
      created: "2013-09-26T06:26:41.000Z",
      modifier: {
         forename: "Louis",
         surname: "Roberts",
         username: "lroberts"
      },
      modified: "2015-02-10T17:51:28.000Z"
   }, {
      title: "Calderdale Schools",
      nodeRef: "workspace:\/\/SpacesStore\/ea265c69-b457-41ba-a66f-22da519ea071",
      creator: {
         forename: "Brenda",
         surname: "Ramirez",
         username: "bramirez"
      },
      created: "2014-03-07T14:56:41.000Z",
      modifier: {
         forename: "Joyce",
         surname: "Hunt",
         username: "jhunt"
      },
      modified: "2014-12-01T22:42:48.000Z"
   }, {
      title: "DSG Senior Staff Data",
      nodeRef: "workspace:\/\/SpacesStore\/448e4a94-2a68-44cf-8b84-c883a54b261f",
      creator: {
         forename: "Dennis",
         surname: "Ramos",
         username: "dramos"
      },
      created: "2013-10-04T03:01:13.000Z",
      modifier: {
         forename: "Mary",
         surname: "Phillips",
         username: "mphillips"
      },
      modified: "2014-12-11T14:27:04.000Z"
   }, {
      title: "Methodology Changes",
      nodeRef: "workspace:\/\/SpacesStore\/92291252-46b6-4f5f-9318-a05092e08dc6",
      creator: {
         forename: "Benjamin",
         surname: "James",
         username: "bjames"
      },
      created: "2013-12-09T05:35:06.000Z",
      modifier: {
         forename: "Diana",
         surname: "Wagner",
         username: "dwagner"
      },
      modified: "2015-07-18T09:06:06.000Z"
   }, {
      title: "Neath Port Talbot",
      nodeRef: "workspace:\/\/SpacesStore\/d6290ee1-95ed-413c-9742-c544a59459a8",
      creator: {
         forename: "Betty",
         surname: "Daniels",
         username: "bdaniels"
      },
      created: "2014-03-02T11:31:00.000Z",
      modifier: {
         forename: "Louise",
         surname: "Ramos",
         username: "lramos"
      },
      modified: "2014-10-16T06:11:26.000Z"
   }, {
      title: "Polling Stations",
      nodeRef: "workspace:\/\/SpacesStore\/934fe069-7a9c-4e57-8efe-b04436ff9be8",
      creator: {
         forename: "Carl",
         surname: "Patterson",
         username: "cpatterson"
      },
      created: "2014-05-08T14:43:50.000Z",
      modifier: {
         forename: "Scott",
         surname: "Allen",
         username: "sallen"
      },
      modified: "2015-04-23T01:57:38.000Z"
   }, {
      title: "Defra Greening Government commitments",
      nodeRef: "workspace:\/\/SpacesStore\/7a307aed-4bb3-4787-8c1a-2b9afbadfc2a",
      creator: {
         forename: "Brian",
         surname: "Williamson",
         username: "bwilliamson"
      },
      created: "2014-06-20T22:09:48.000Z",
      modifier: {
         forename: "Brian",
         surname: "Turner",
         username: "bturner"
      },
      modified: "2015-03-03T08:12:37.000Z"
   }, {
      title: "DBS list of current Registered and Umbrella Bodies",
      nodeRef: "workspace:\/\/SpacesStore\/8a9e3187-3a95-4029-a396-554ee531364e",
      creator: {
         forename: "Jose",
         surname: "Kennedy",
         username: "jkennedy"
      },
      created: "2013-09-08T12:04:44.000Z",
      modifier: {
         forename: "Clarence",
         surname: "Mason",
         username: "cmason"
      },
      modified: "2015-01-11T12:11:50.000Z"
   }, {
      title: "CIM Supporting Information",
      nodeRef: "workspace:\/\/SpacesStore\/eb540f6b-ec81-4591-88f0-e299f128f1b3",
      creator: {
         forename: "Mary",
         surname: "Henry",
         username: "mhenry"
      },
      created: "2014-04-04T00:51:47.000Z",
      modifier: {
         forename: "Samuel",
         surname: "Hernandez",
         username: "shernandez"
      },
      modified: "2015-03-12T05:59:52.000Z"
   }, {
      title: "MOD live energy data",
      nodeRef: "workspace:\/\/SpacesStore\/dd3262e6-bc98-4dc9-a4c1-2bdc2b4b18b6",
      creator: {
         forename: "Paul",
         surname: "Thompson",
         username: "pthompson"
      },
      created: "2013-12-25T22:32:53.000Z",
      modifier: {
         forename: "Jeremy",
         surname: "Green",
         username: "jgreen"
      },
      modified: "2014-11-09T11:15:42.000Z"
   }, {
      title: "Conservation Area guidelines",
      nodeRef: "workspace:\/\/SpacesStore\/8b9bcd48-78a1-46b3-81d0-8103160a71f1",
      creator: {
         forename: "Richard",
         surname: "Moreno",
         username: "rmoreno"
      },
      created: "2013-10-12T19:55:31.000Z",
      modifier: {
         forename: "Mildred",
         surname: "Franklin",
         username: "mfranklin"
      },
      modified: "2015-05-19T04:08:19.000Z"
   }, {
      title: "Gender Success Rates",
      nodeRef: "workspace:\/\/SpacesStore\/cc32a239-f081-4393-90c7-a83ed6e1b6eb",
      creator: {
         forename: "Andrew",
         surname: "Gibson",
         username: "agibson"
      },
      created: "2014-05-18T14:26:35.000Z",
      modifier: {
         forename: "Arthur",
         surname: "Kelley",
         username: "akelley"
      },
      modified: "2014-09-24T04:55:12.000Z"
   }, {
      title: "Articles of Constitution",
      nodeRef: "workspace:\/\/SpacesStore\/3a0c90f5-c2b6-4556-833b-a623eee8a141",
      creator: {
         forename: "Janet",
         surname: "Kelly",
         username: "jkelly"
      },
      created: "2013-10-03T07:35:57.000Z",
      modifier: {
         forename: "Andrea",
         surname: "Gardner",
         username: "agardner"
      },
      modified: "2014-10-11T07:02:38.000Z"
   }, {
      title: "Weymouth and Portland",
      nodeRef: "workspace:\/\/SpacesStore\/eaaee935-6a1b-4bca-8696-d62ef683555b",
      creator: {
         forename: "Bruce",
         surname: "Reid",
         username: "breid"
      },
      created: "2014-06-09T22:27:57.000Z",
      modifier: {
         forename: "Carolyn",
         surname: "Fields",
         username: "cfields"
      },
      modified: "2015-05-27T18:30:17.000Z"
   }, {
      title: "Public Data Group Survey",
      nodeRef: "workspace:\/\/SpacesStore\/e6a4ad2f-c9a9-46b9-a010-0696b35e54b1",
      creator: {
         forename: "Pamela",
         surname: "Simpson",
         username: "psimpson"
      },
      created: "2014-02-16T13:48:31.000Z",
      modifier: {
         forename: "Ruth",
         surname: "Robertson",
         username: "rrobertson"
      },
      modified: "2015-04-24T12:28:21.000Z"
   }, {
      title: "Staffordshire Moorlands",
      nodeRef: "workspace:\/\/SpacesStore\/949f5586-4d36-4141-a4a0-1d03e9cab0b0",
      creator: {
         forename: "Ralph",
         surname: "Knight",
         username: "rknight"
      },
      created: "2014-02-27T19:21:19.000Z",
      modifier: {
         forename: "Janice",
         surname: "Burton",
         username: "jburton"
      },
      modified: "2014-11-16T11:10:16.000Z"
   }, {
      title: "Additional Tables",
      nodeRef: "workspace:\/\/SpacesStore\/6a0c4d3b-b58e-4f3f-a776-b841d16e02c6",
      creator: {
         forename: "Beverly",
         surname: "Kim",
         username: "bkim"
      },
      created: "2014-06-21T05:35:33.000Z",
      modifier: {
         forename: "Kimberly",
         surname: "Lewis",
         username: "klewis"
      },
      modified: "2015-02-24T22:28:44.000Z"
   }, {
      title: "BNB Serials RDF",
      nodeRef: "workspace:\/\/SpacesStore\/e762063a-7df9-4a6b-999c-e6a25da05887",
      creator: {
         forename: "Rachel",
         surname: "Jenkins",
         username: "rjenkins"
      },
      created: "2014-03-21T03:24:24.000Z",
      modifier: {
         forename: "Amanda",
         surname: "Ferguson",
         username: "aferguson"
      },
      modified: "2014-08-28T20:58:25.000Z"
   }, {
      title: "Landing page",
      nodeRef: "workspace:\/\/SpacesStore\/32a78de2-a5b4-4529-95e3-9c7f5673217a",
      creator: {
         forename: "Tammy",
         surname: "Brown",
         username: "tbrown"
      },
      created: "2014-05-09T20:13:16.000Z",
      modifier: {
         forename: "Martha",
         surname: "Harrison",
         username: "mharrison"
      },
      modified: "2014-10-25T01:06:36.000Z"
   }, {
      title: "Title Page",
      nodeRef: "workspace:\/\/SpacesStore\/d53f3cde-831d-4218-a5d2-549b18376f32",
      creator: {
         forename: "Randy",
         surname: "Butler",
         username: "rbutler"
      },
      created: "2014-05-13T01:16:27.000Z",
      modifier: {
         forename: "Michael",
         surname: "Jackson",
         username: "mjackson"
      },
      modified: "2015-07-11T00:24:08.000Z"
   }, {
      title: "Internal appointments by sexual orientation",
      nodeRef: "workspace:\/\/SpacesStore\/e3b20373-150c-473e-b237-99202008a4c6",
      creator: {
         forename: "Keith",
         surname: "Alvarez",
         username: "kalvarez"
      },
      created: "2014-07-25T00:35:40.000Z",
      modifier: {
         forename: "Ernest",
         surname: "Hall",
         username: "ehall"
      },
      modified: "2015-07-09T06:17:36.000Z"
   }, {
      title: "Internal applicants by ethnicity",
      nodeRef: "workspace:\/\/SpacesStore\/1545d7d9-e338-4364-a45d-9ce7dfa2c3f2",
      creator: {
         forename: "Donald",
         surname: "Marshall",
         username: "dmarshall"
      },
      created: "2013-11-06T12:35:54.000Z",
      modifier: {
         forename: "Lawrence",
         surname: "Mason",
         username: "lmason"
      },
      modified: "2015-03-31T09:31:39.000Z"
   }, {
      title: "MHMDS Summary Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/ebd3261e-aab8-4921-a1b5-caa921369c24",
      creator: {
         forename: "Theresa",
         surname: "Snyder",
         username: "tsnyder"
      },
      created: "2013-09-15T09:45:16.000Z",
      modifier: {
         forename: "Laura",
         surname: "Fernandez",
         username: "lfernandez"
      },
      modified: "2014-08-28T14:05:55.000Z"
   }, {
      title: "West Devon",
      nodeRef: "workspace:\/\/SpacesStore\/c0c7ac7f-e438-4839-9c04-6f53b3157b2c",
      creator: {
         forename: "Stephen",
         surname: "Wallace",
         username: "swallace"
      },
      created: "2014-01-03T14:25:39.000Z",
      modifier: {
         forename: "Ruth",
         surname: "Hall",
         username: "rhall"
      },
      modified: "2015-06-28T00:19:28.000Z"
   }, {
      title: "Senior staff posts",
      nodeRef: "workspace:\/\/SpacesStore\/63d68d1f-8f05-42d4-83c9-4d841abc5360",
      creator: {
         forename: "Fred",
         surname: "Hayes",
         username: "fhayes"
      },
      created: "2014-01-10T20:59:33.000Z",
      modifier: {
         forename: "Martin",
         surname: "Pierce",
         username: "mpierce"
      },
      modified: "2015-06-10T12:14:39.000Z"
   }, {
      title: "Tables on Planning Applications",
      nodeRef: "workspace:\/\/SpacesStore\/777381b0-d5b5-4ba0-bdac-aa4fddf9037d",
      creator: {
         forename: "Jeremy",
         surname: "Wagner",
         username: "jwagner"
      },
      created: "2013-10-22T01:41:40.000Z",
      modifier: {
         forename: "John",
         surname: "Nelson",
         username: "jnelson"
      },
      modified: "2015-02-22T18:34:13.000Z"
   }, {
      title: "MVDC Organisation Structure",
      nodeRef: "workspace:\/\/SpacesStore\/38787ecf-5617-4ddb-ab40-f668a9f427f9",
      creator: {
         forename: "Ashley",
         surname: "Robertson",
         username: "arobertson"
      },
      created: "2013-10-28T01:55:27.000Z",
      modifier: {
         forename: "Ernest",
         surname: "Warren",
         username: "ewarren"
      },
      modified: "2015-05-30T01:34:53.000Z"
   }, {
      title: "National Coach Services Data",
      nodeRef: "workspace:\/\/SpacesStore\/b3656dfa-296e-4758-9bb0-90068a14c337",
      creator: {
         forename: "Gregory",
         surname: "Franklin",
         username: "gfranklin"
      },
      created: "2014-05-12T09:12:09.000Z",
      modifier: {
         forename: "Kathleen",
         surname: "George",
         username: "kgeorge"
      },
      modified: "2015-04-06T05:53:31.000Z"
   }, {
      title: "Live Tables",
      nodeRef: "workspace:\/\/SpacesStore\/57092646-09fe-4890-b75c-94b3d2fa88af",
      creator: {
         forename: "Ashley",
         surname: "Ray",
         username: "aray"
      },
      created: "2013-11-15T05:23:47.000Z",
      modifier: {
         forename: "Teresa",
         surname: "Nguyen",
         username: "tnguyen"
      },
      modified: "2015-07-31T11:21:09.000Z"
   }, {
      title: "Destination lookup tables",
      nodeRef: "workspace:\/\/SpacesStore\/7fd5358b-53a6-4f83-b7e5-e244d9a79c00",
      creator: {
         forename: "Susan",
         surname: "Johnston",
         username: "sjohnston"
      },
      created: "2014-08-14T04:04:10.000Z",
      modifier: {
         forename: "Melissa",
         surname: "Hall",
         username: "mhall"
      },
      modified: "2015-08-12T23:24:42.000Z"
   }, {
      title: "Main NJR website",
      nodeRef: "workspace:\/\/SpacesStore\/06b5e3be-cd79-4f77-9fac-444010d00054",
      creator: {
         forename: "Patrick",
         surname: "Warren",
         username: "pwarren"
      },
      created: "2013-09-17T16:43:25.000Z",
      modifier: {
         forename: "Maria",
         surname: "Richards",
         username: "mrichards"
      },
      modified: "2015-03-20T17:30:24.000Z"
   }, {
      title: "High Peak",
      nodeRef: "workspace:\/\/SpacesStore\/9c4c45eb-7298-450c-9621-fada6b2ebcf4",
      creator: {
         forename: "Eric",
         surname: "Campbell",
         username: "ecampbell"
      },
      created: "2014-07-03T23:34:21.000Z",
      modifier: {
         forename: "Cynthia",
         surname: "Castillo",
         username: "ccastillo"
      },
      modified: "2014-10-09T06:45:25.000Z"
   }, {
      title: "MINAP webpages",
      nodeRef: "workspace:\/\/SpacesStore\/b5489440-66eb-4fe6-8c59-e6b6f4be6ee8",
      creator: {
         forename: "Fred",
         surname: "Porter",
         username: "fporter"
      },
      created: "2013-10-13T15:16:12.000Z",
      modifier: {
         forename: "Louise",
         surname: "Dean",
         username: "ldean"
      },
      modified: "2015-04-09T17:11:32.000Z"
   }, {
      title: "Stockport Transport Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/80ff88a7-8028-40ca-b2d7-6ecb34b56690",
      creator: {
         forename: "Stephen",
         surname: "Andrews",
         username: "sandrews"
      },
      created: "2013-11-21T17:21:39.000Z",
      modifier: {
         forename: "Bobby",
         surname: "Reyes",
         username: "breyes"
      },
      modified: "2015-03-12T13:26:13.000Z"
   }, {
      title: "Headcount FTE",
      nodeRef: "workspace:\/\/SpacesStore\/a3d0c594-d72e-40a0-b3f0-dd4c46a04df3",
      creator: {
         forename: "Tammy",
         surname: "Duncan",
         username: "tduncan"
      },
      created: "2013-12-30T12:52:42.000Z",
      modifier: {
         forename: "Christine",
         surname: "Armstrong",
         username: "carmstrong"
      },
      modified: "2015-01-09T20:09:17.000Z"
   }, {
      title: "Stockport main report",
      nodeRef: "workspace:\/\/SpacesStore\/2740ecac-3901-41f3-8179-48e737a16071",
      creator: {
         forename: "Linda",
         surname: "Reid",
         username: "lreid"
      },
      created: "2013-10-20T08:45:18.000Z",
      modifier: {
         forename: "Brian",
         surname: "Murray",
         username: "bmurray"
      },
      modified: "2015-05-03T15:07:57.000Z"
   }, {
      title: "Resource feed",
      nodeRef: "workspace:\/\/SpacesStore\/844c48cb-5a27-4dc6-b8cc-2ccbaa4fafa7",
      creator: {
         forename: "Alan",
         surname: "Castillo",
         username: "acastillo"
      },
      created: "2014-02-17T02:31:37.000Z",
      modifier: {
         forename: "Helen",
         surname: "Vasquez",
         username: "hvasquez"
      },
      modified: "2015-06-02T10:37:49.000Z"
   }, {
      title: "Bicycle theft",
      nodeRef: "workspace:\/\/SpacesStore\/80811dc3-5b36-4e95-ab46-4c6fcbd85ba5",
      creator: {
         forename: "Raymond",
         surname: "Little",
         username: "rlittle"
      },
      created: "2014-03-01T01:58:55.000Z",
      modifier: {
         forename: "Kenneth",
         surname: "Mason",
         username: "kmason"
      },
      modified: "2014-12-03T08:28:10.000Z"
   }, {
      title: "CCG Prescribing Data",
      nodeRef: "workspace:\/\/SpacesStore\/547e6d6c-acb1-46cc-b932-5efbd555f484",
      creator: {
         forename: "Jeremy",
         surname: "Wood",
         username: "jwood"
      },
      created: "2013-11-05T21:15:45.000Z",
      modifier: {
         forename: "Anne",
         surname: "Welch",
         username: "awelch"
      },
      modified: "2015-04-01T06:08:51.000Z"
   }, {
      title: "Links to spend spreadsheets",
      nodeRef: "workspace:\/\/SpacesStore\/374f3ee6-6402-4a6f-b81b-1e01f65d9bc8",
      creator: {
         forename: "Adam",
         surname: "Lewis",
         username: "alewis"
      },
      created: "2014-01-07T23:12:58.000Z",
      modifier: {
         forename: "Ryan",
         surname: "Perry",
         username: "rperry"
      },
      modified: "2015-05-15T11:03:41.000Z"
   }, {
      title: "CRB check performance figures",
      nodeRef: "workspace:\/\/SpacesStore\/6b10f8a4-5ddf-4e87-90dc-80f413366a49",
      creator: {
         forename: "Jeremy",
         surname: "Bailey",
         username: "jbailey"
      },
      created: "2014-04-23T14:44:11.000Z",
      modifier: {
         forename: "Harold",
         surname: "Day",
         username: "hday"
      },
      modified: "2015-04-25T22:52:31.000Z"
   }, {
      title: "Listed Buildings Metadata",
      nodeRef: "workspace:\/\/SpacesStore\/b8ed6f57-7298-401a-8a80-702caebf925b",
      creator: {
         forename: "Jacqueline",
         surname: "King",
         username: "jking"
      },
      created: "2013-09-30T22:11:31.000Z",
      modifier: {
         forename: "Janice",
         surname: "Green",
         username: "jgreen"
      },
      modified: "2015-01-27T22:18:44.000Z"
   }, {
      title: "Clinical Commissioning Group Sites",
      nodeRef: "workspace:\/\/SpacesStore\/e0a147d2-81f0-415b-8f80-c2b58bdcb4ca",
      creator: {
         forename: "Diana",
         surname: "Murphy",
         username: "dmurphy"
      },
      created: "2014-03-28T07:29:10.000Z",
      modifier: {
         forename: "Jean",
         surname: "Larson",
         username: "jlarson"
      },
      modified: "2014-09-22T02:34:35.000Z"
   }, {
      title: "Purbeck Heritage Coast",
      nodeRef: "workspace:\/\/SpacesStore\/26f20d19-8225-44d2-b5ec-1e8ab1e83c04",
      creator: {
         forename: "Diana",
         surname: "Mason",
         username: "dmason"
      },
      created: "2014-02-01T05:48:27.000Z",
      modifier: {
         forename: "Julia",
         surname: "Elliott",
         username: "jelliott"
      },
      modified: "2014-11-27T14:25:20.000Z"
   }, {
      title: "House Building Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/1748dbfb-3312-42db-a7d5-2e54cf603dbb",
      creator: {
         forename: "Julie",
         surname: "Henderson",
         username: "jhenderson"
      },
      created: "2014-08-02T21:35:43.000Z",
      modifier: {
         forename: "Eric",
         surname: "Williamson",
         username: "ewilliamson"
      },
      modified: "2015-07-05T22:14:33.000Z"
   }, {
      title: "Parking Account Metadata",
      nodeRef: "workspace:\/\/SpacesStore\/a60c63e0-e931-42f4-ab30-e8415b3b48cd",
      creator: {
         forename: "Sean",
         surname: "Rivera",
         username: "srivera"
      },
      created: "2014-05-15T19:11:35.000Z",
      modifier: {
         forename: "Benjamin",
         surname: "Snyder",
         username: "bsnyder"
      },
      modified: "2015-08-01T16:42:38.000Z"
   }, {
      title: "Air Command",
      nodeRef: "workspace:\/\/SpacesStore\/806bf926-14a4-4c11-8c7e-800419722303",
      creator: {
         forename: "Sandra",
         surname: "Greene",
         username: "sgreene"
      },
      created: "2014-04-11T01:30:20.000Z",
      modifier: {
         forename: "Joe",
         surname: "Walker",
         username: "jwalker"
      },
      modified: "2015-06-22T14:21:45.000Z"
   }, {
      title: "UK Visas and Immigration",
      nodeRef: "workspace:\/\/SpacesStore\/0650d0dc-3f0b-40dc-9db3-c09f4d8e8f3e",
      creator: {
         forename: "Laura",
         surname: "Carter",
         username: "lcarter"
      },
      created: "2013-08-30T02:54:05.000Z",
      modifier: {
         forename: "George",
         surname: "Barnes",
         username: "gbarnes"
      },
      modified: "2015-05-21T02:19:49.000Z"
   }, {
      title: "Published quarterly",
      nodeRef: "workspace:\/\/SpacesStore\/105a1a3e-9872-44d6-b566-6c196f0626fc",
      creator: {
         forename: "Tina",
         surname: "Nguyen",
         username: "tnguyen"
      },
      created: "2014-05-04T15:48:56.000Z",
      modifier: {
         forename: "Kevin",
         surname: "Ellis",
         username: "kellis"
      },
      modified: "2014-12-31T09:19:00.000Z"
   }, {
      title: "Food Hygiene Ratings",
      nodeRef: "workspace:\/\/SpacesStore\/37443421-0879-434f-bcfd-601c9cea4b3f",
      creator: {
         forename: "Wanda",
         surname: "Reyes",
         username: "wreyes"
      },
      created: "2013-08-25T20:22:53.000Z",
      modifier: {
         forename: "Patricia",
         surname: "Perez",
         username: "pperez"
      },
      modified: "2015-07-08T18:42:42.000Z"
   }, {
      title: "Venture data",
      nodeRef: "workspace:\/\/SpacesStore\/3ff922cf-541c-44db-8f2b-33730de2c4b5",
      creator: {
         forename: "Amy",
         surname: "Fuller",
         username: "afuller"
      },
      created: "2014-04-22T14:15:53.000Z",
      modifier: {
         forename: "Laura",
         surname: "Ramos",
         username: "lramos"
      },
      modified: "2015-04-21T23:10:18.000Z"
   }, {
      title: "Delegates for training by age",
      nodeRef: "workspace:\/\/SpacesStore\/a216c4de-3633-4cd1-8ba1-f6997c1f0a14",
      creator: {
         forename: "Carlos",
         surname: "Hicks",
         username: "chicks"
      },
      created: "2014-07-05T08:21:27.000Z",
      modifier: {
         forename: "Deborah",
         surname: "Hansen",
         username: "dhansen"
      },
      modified: "2014-09-30T23:49:14.000Z"
   }, {
      title: "Gritter locations",
      nodeRef: "workspace:\/\/SpacesStore\/8a1a14b9-c6b9-465d-b5af-1f8f3bd58c24",
      creator: {
         forename: "Steven",
         surname: "Roberts",
         username: "sroberts"
      },
      created: "2013-11-18T15:17:43.000Z",
      modifier: {
         forename: "Jesse",
         surname: "Reynolds",
         username: "jreynolds"
      },
      modified: "2015-04-03T02:36:15.000Z"
   }, {
      title: "DBS barring list data",
      nodeRef: "workspace:\/\/SpacesStore\/2baa11c8-27b1-4c69-bbba-fbba9bc79041",
      creator: {
         forename: "Steve",
         surname: "Rose",
         username: "srose"
      },
      created: "2014-08-09T13:15:11.000Z",
      modifier: {
         forename: "Steven",
         surname: "Harris",
         username: "sharris"
      },
      modified: "2015-06-21T16:55:54.000Z"
   }, {
      title: "Local Authority Land",
      nodeRef: "workspace:\/\/SpacesStore\/75dcef5c-0fd0-412c-8db4-290f1e11e24c",
      creator: {
         forename: "Jean",
         surname: "Medina",
         username: "jmedina"
      },
      created: "2014-04-17T16:37:47.000Z",
      modifier: {
         forename: "Carlos",
         surname: "Chapman",
         username: "cchapman"
      },
      modified: "2015-01-04T14:10:00.000Z"
   }, {
      title: "Business Rates",
      nodeRef: "workspace:\/\/SpacesStore\/3de72415-fd1f-41be-88ad-bcb642144dea",
      creator: {
         forename: "Randy",
         surname: "James",
         username: "rjames"
      },
      created: "2013-08-31T21:02:38.000Z",
      modifier: {
         forename: "Sarah",
         surname: "Watson",
         username: "swatson"
      },
      modified: "2014-08-26T22:01:33.000Z"
   }, {
      title: "Fords in Devon XML",
      nodeRef: "workspace:\/\/SpacesStore\/bb76b6cf-848b-4a71-9162-9580698981a7",
      creator: {
         forename: "Kimberly",
         surname: "Gonzalez",
         username: "kgonzalez"
      },
      created: "2013-10-01T17:12:08.000Z",
      modifier: {
         forename: "Ronald",
         surname: "Cooper",
         username: "rcooper"
      },
      modified: "2014-12-05T06:55:10.000Z"
   }, {
      title: "NHS IC Staff Data",
      nodeRef: "workspace:\/\/SpacesStore\/292765b5-8860-4cf5-ad63-3c53246a1dfc",
      creator: {
         forename: "Russell",
         surname: "Wood",
         username: "rwood"
      },
      created: "2013-10-07T14:54:41.000Z",
      modifier: {
         forename: "Julia",
         surname: "Carr",
         username: "jcarr"
      },
      modified: "2015-04-21T22:30:39.000Z"
   }, {
      title: "CMR WAL data",
      nodeRef: "workspace:\/\/SpacesStore\/e7878116-2ad7-499a-bd9e-e07c499fe2f2",
      creator: {
         forename: "Jeffrey",
         surname: "Andrews",
         username: "jandrews"
      },
      created: "2013-10-18T00:53:53.000Z",
      modifier: {
         forename: "Phyllis",
         surname: "Barnes",
         username: "pbarnes"
      },
      modified: "2014-10-23T01:50:45.000Z"
   }, {
      title: "Executive management comittee",
      nodeRef: "workspace:\/\/SpacesStore\/bd0f8872-f6e3-4fb7-9eb3-b77ceada63de",
      creator: {
         forename: "Steven",
         surname: "Harvey",
         username: "sharvey"
      },
      created: "2014-04-02T16:52:00.000Z",
      modifier: {
         forename: "Steve",
         surname: "Foster",
         username: "sfoster"
      },
      modified: "2015-04-23T15:09:38.000Z"
   }, {
      title: "Monthly Amendment files",
      nodeRef: "workspace:\/\/SpacesStore\/e9bf7c96-5bc7-4e0d-94e4-9033421f6b82",
      creator: {
         forename: "Anthony",
         surname: "Fowler",
         username: "afowler"
      },
      created: "2014-02-04T03:51:48.000Z",
      modifier: {
         forename: "Ruby",
         surname: "Chapman",
         username: "rchapman"
      },
      modified: "2015-06-07T13:26:24.000Z"
   }, {
      title: "Hull City",
      nodeRef: "workspace:\/\/SpacesStore\/27298e51-e2dd-4d94-8bcd-d2b932ae6012",
      creator: {
         forename: "Marilyn",
         surname: "Price",
         username: "mprice"
      },
      created: "2013-09-03T08:07:52.000Z",
      modifier: {
         forename: "Jack",
         surname: "Freeman",
         username: "jfreeman"
      },
      modified: "2015-06-14T06:38:15.000Z"
   }, {
      title: "South West",
      nodeRef: "workspace:\/\/SpacesStore\/e102b4fe-7540-4a59-a2f9-1ea68ca8662d",
      creator: {
         forename: "Stephen",
         surname: "Watkins",
         username: "swatkins"
      },
      created: "2013-09-17T04:16:57.000Z",
      modifier: {
         forename: "Michael",
         surname: "Medina",
         username: "mmedina"
      },
      modified: "2014-09-01T22:41:50.000Z"
   }, {
      title: "CMR WAL TV data",
      nodeRef: "workspace:\/\/SpacesStore\/bf289302-d670-4fd1-bf6d-b6165613fa02",
      creator: {
         forename: "Antonio",
         surname: "Reynolds",
         username: "areynolds"
      },
      created: "2014-08-08T14:48:30.000Z",
      modifier: {
         forename: "Laura",
         surname: "Hart",
         username: "lhart"
      },
      modified: "2014-10-19T08:34:48.000Z"
   }, {
      title: "Chart of Accounts xls",
      nodeRef: "workspace:\/\/SpacesStore\/982f3db8-39d7-4049-9f60-fc2577e810c5",
      creator: {
         forename: "Tammy",
         surname: "Ramirez",
         username: "tramirez"
      },
      created: "2014-04-27T21:20:25.000Z",
      modifier: {
         forename: "Wanda",
         surname: "Ruiz",
         username: "wruiz"
      },
      modified: "2015-02-22T03:20:53.000Z"
   }, {
      title: "Recycling Centre Locations",
      nodeRef: "workspace:\/\/SpacesStore\/c9c2ea38-563f-4925-a456-ae19ac40bff7",
      creator: {
         forename: "Terry",
         surname: "Patterson",
         username: "tpatterson"
      },
      created: "2014-03-29T11:31:53.000Z",
      modifier: {
         forename: "Maria",
         surname: "Lane",
         username: "mlane"
      },
      modified: "2015-01-30T00:43:22.000Z"
   }, {
      title: "Adult Participation and Achievements",
      nodeRef: "workspace:\/\/SpacesStore\/b522fb2f-93d3-499c-b175-1b894b8da17c",
      creator: {
         forename: "Ernest",
         surname: "Tucker",
         username: "etucker"
      },
      created: "2014-04-17T23:23:36.000Z",
      modifier: {
         forename: "Edward",
         surname: "Morris",
         username: "emorris"
      },
      modified: "2014-09-28T05:28:20.000Z"
   }, {
      title: "Scrap Metal Dealers",
      nodeRef: "workspace:\/\/SpacesStore\/41ae20b9-439a-4a4a-9eb3-c985ae28a389",
      creator: {
         forename: "Teresa",
         surname: "Frazier",
         username: "tfrazier"
      },
      created: "2014-04-24T16:46:08.000Z",
      modifier: {
         forename: "Diane",
         surname: "Garrett",
         username: "dgarrett"
      },
      modified: "2015-08-03T17:30:09.000Z"
   }, {
      title: "Tree PreservationsOorders",
      nodeRef: "workspace:\/\/SpacesStore\/31d88b23-63b5-4310-ba8a-70cef67af004",
      creator: {
         forename: "Phillip",
         surname: "Baker",
         username: "pbaker"
      },
      created: "2013-10-20T07:32:58.000Z",
      modifier: {
         forename: "Barbara",
         surname: "Hunter",
         username: "bhunter"
      },
      modified: "2015-07-18T11:33:16.000Z"
   }, {
      title: "Sources of RBWM Income",
      nodeRef: "workspace:\/\/SpacesStore\/80624a74-2792-41e7-835d-6bd702f189c9",
      creator: {
         forename: "Justin",
         surname: "Mills",
         username: "jmills"
      },
      created: "2014-06-06T16:37:35.000Z",
      modifier: {
         forename: "Anthony",
         surname: "Tucker",
         username: "atucker"
      },
      modified: "2015-06-07T18:55:53.000Z"
   }, {
      title: "Rochdale Transport Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/66924c07-d19d-4a0a-b9ce-ecca98393755",
      creator: {
         forename: "Gregory",
         surname: "West",
         username: "gwest"
      },
      created: "2013-09-10T09:00:21.000Z",
      modifier: {
         forename: "Chris",
         surname: "Martin",
         username: "cmartin"
      },
      modified: "2015-03-25T16:36:58.000Z"
   }, {
      title: "August Data",
      nodeRef: "workspace:\/\/SpacesStore\/501d07b1-14de-442b-8b38-2b6e0d6e3a76",
      creator: {
         forename: "Arthur",
         surname: "Baker",
         username: "abaker"
      },
      created: "2014-07-29T18:20:12.000Z",
      modifier: {
         forename: "Carlos",
         surname: "Griffin",
         username: "cgriffin"
      },
      modified: "2015-01-02T05:46:24.000Z"
   }, {
      title: "Internal applicants by religion",
      nodeRef: "workspace:\/\/SpacesStore\/fc243b22-c2b2-497b-b8c4-ab839c4a7a3f",
      creator: {
         forename: "Raymond",
         surname: "Woods",
         username: "rwoods"
      },
      created: "2014-08-06T19:25:55.000Z",
      modifier: {
         forename: "Emily",
         surname: "Carroll",
         username: "ecarroll"
      },
      modified: "2014-08-21T08:38:24.000Z"
   }, {
      title: "South Northamptonshire",
      nodeRef: "workspace:\/\/SpacesStore\/91bfcd35-288f-469d-9915-56cadd99ab89",
      creator: {
         forename: "Andrew",
         surname: "Foster",
         username: "afoster"
      },
      created: "2014-04-30T03:46:51.000Z",
      modifier: {
         forename: "Michelle",
         surname: "Perry",
         username: "mperry"
      },
      modified: "2014-12-02T12:42:13.000Z"
   }, {
      title: "Policy and Strategy Register",
      nodeRef: "workspace:\/\/SpacesStore\/a42b5dfb-464e-44cc-901f-98b31c374a27",
      creator: {
         forename: "Philip",
         surname: "Hansen",
         username: "phansen"
      },
      created: "2014-07-03T05:05:24.000Z",
      modifier: {
         forename: "Walter",
         surname: "Patterson",
         username: "wpatterson"
      },
      modified: "2015-05-31T14:19:13.000Z"
   }, {
      title: "Report home page",
      nodeRef: "workspace:\/\/SpacesStore\/787ddc1d-730b-4a7a-a9dd-b61ff876ed78",
      creator: {
         forename: "Albert",
         surname: "Vasquez",
         username: "avasquez"
      },
      created: "2014-04-17T01:37:11.000Z",
      modifier: {
         forename: "Melissa",
         surname: "Burns",
         username: "mburns"
      },
      modified: "2014-11-07T03:06:40.000Z"
   }, {
      title: "Prescribing by Dentists",
      nodeRef: "workspace:\/\/SpacesStore\/51265c3e-4f0e-4f50-9f87-5ffa2c9553cb",
      creator: {
         forename: "Ryan",
         surname: "Bradley",
         username: "rbradley"
      },
      created: "2014-05-12T23:50:48.000Z",
      modifier: {
         forename: "James",
         surname: "Howard",
         username: "jhoward"
      },
      modified: "2015-03-29T19:07:09.000Z"
   }, {
      title: "Promoting high performance working",
      nodeRef: "workspace:\/\/SpacesStore\/d968f03a-c197-41c8-8b8c-208142af0f2a",
      creator: {
         forename: "Patricia",
         surname: "Ferguson",
         username: "pferguson"
      },
      created: "2013-09-24T11:38:24.000Z",
      modifier: {
         forename: "Karen",
         surname: "Long",
         username: "klong"
      },
      modified: "2015-07-30T19:52:16.000Z"
   }, {
      title: "Service user questionnaire",
      nodeRef: "workspace:\/\/SpacesStore\/f6425b5d-5079-44ef-a9a2-011cdcb1be1c",
      creator: {
         forename: "Daniel",
         surname: "Jones",
         username: "djones"
      },
      created: "2014-07-12T04:24:24.000Z",
      modifier: {
         forename: "Helen",
         surname: "Cox",
         username: "hcox"
      },
      modified: "2015-08-16T16:39:23.000Z"
   }, {
      title: "Methodological changes",
      nodeRef: "workspace:\/\/SpacesStore\/29405657-d40b-4371-9307-4a1b232a2ecc",
      creator: {
         forename: "Betty",
         surname: "Tucker",
         username: "btucker"
      },
      created: "2014-02-18T16:09:13.000Z",
      modifier: {
         forename: "Diane",
         surname: "Rogers",
         username: "drogers"
      },
      modified: "2014-09-28T06:40:01.000Z"
   }, {
      title: "HQIP Website",
      nodeRef: "workspace:\/\/SpacesStore\/d9889b71-4364-4bdf-a505-930fbcbb3c7b",
      creator: {
         forename: "Sean",
         surname: "Fox",
         username: "sfox"
      },
      created: "2014-05-13T18:45:55.000Z",
      modifier: {
         forename: "Sean",
         surname: "Stevens",
         username: "sstevens"
      },
      modified: "2014-12-14T15:22:15.000Z"
   }, {
      title: "Northumberland Councillors",
      nodeRef: "workspace:\/\/SpacesStore\/b37ed4ca-7cbd-41d5-ba89-9eef36aed5ba",
      creator: {
         forename: "Gary",
         surname: "Watson",
         username: "gwatson"
      },
      created: "2013-10-27T03:43:41.000Z",
      modifier: {
         forename: "Eugene",
         surname: "Bennett",
         username: "ebennett"
      },
      modified: "2014-11-29T10:00:35.000Z"
   }, {
      title: "MVDC Pay Multiple",
      nodeRef: "workspace:\/\/SpacesStore\/6328e6f1-f363-4f8d-b241-310b46971a1b",
      creator: {
         forename: "Steven",
         surname: "Fox",
         username: "sfox"
      },
      created: "2013-10-31T22:57:13.000Z",
      modifier: {
         forename: "Clarence",
         surname: "Castillo",
         username: "ccastillo"
      },
      modified: "2014-11-06T10:59:14.000Z"
   }, {
      title: "Dog Bins in York",
      nodeRef: "workspace:\/\/SpacesStore\/169e56c0-d18a-4602-a643-d2c395366e07",
      creator: {
         forename: "Sharon",
         surname: "Hunt",
         username: "shunt"
      },
      created: "2014-05-09T05:00:26.000Z",
      modifier: {
         forename: "Jesse",
         surname: "Gonzales",
         username: "jgonzales"
      },
      modified: "2014-11-25T07:21:11.000Z"
   }, {
      title: "Revised January data",
      nodeRef: "workspace:\/\/SpacesStore\/4882aac2-0fae-45eb-b0f3-bf6d45a6e9c9",
      creator: {
         forename: "Sara",
         surname: "Shaw",
         username: "sshaw"
      },
      created: "2014-04-07T21:21:06.000Z",
      modifier: {
         forename: "Joan",
         surname: "Carter",
         username: "jcarter"
      },
      modified: "2015-01-27T21:35:27.000Z"
   }, {
      title: "Count of Senior Salaries",
      nodeRef: "workspace:\/\/SpacesStore\/be09f649-4c6f-4ca3-aec7-3f4924b0db1c",
      creator: {
         forename: "Janet",
         surname: "Jacobs",
         username: "jjacobs"
      },
      created: "2014-03-13T18:33:06.000Z",
      modifier: {
         forename: "Lillian",
         surname: "Hudson",
         username: "lhudson"
      },
      modified: "2014-11-05T19:56:54.000Z"
   }, {
      title: "West Lothian",
      nodeRef: "workspace:\/\/SpacesStore\/f11f40d6-9dcf-4935-8d1d-4513f2524e3d",
      creator: {
         forename: "Teresa",
         surname: "Stewart",
         username: "tstewart"
      },
      created: "2014-06-16T06:08:37.000Z",
      modifier: {
         forename: "Janet",
         surname: "Hernandez",
         username: "jhernandez"
      },
      modified: "2014-11-02T07:12:57.000Z"
   }, {
      title: "Bus Route map data",
      nodeRef: "workspace:\/\/SpacesStore\/8388d92f-1fc6-45ff-a90c-5da6157d8685",
      creator: {
         forename: "Kelly",
         surname: "Young",
         username: "kyoung"
      },
      created: "2014-05-28T20:40:53.000Z",
      modifier: {
         forename: "Melissa",
         surname: "Carroll",
         username: "mcarroll"
      },
      modified: "2015-05-05T10:44:20.000Z"
   }, {
      title: "RBKC Parking Bay data",
      nodeRef: "workspace:\/\/SpacesStore\/be9a82ca-43ba-4a31-9998-e06e74a5a3b8",
      creator: {
         forename: "Jonathan",
         surname: "Peterson",
         username: "jpeterson"
      },
      created: "2013-10-20T00:19:19.000Z",
      modifier: {
         forename: "Andrew",
         surname: "Sanders",
         username: "asanders"
      },
      modified: "2015-05-11T09:04:08.000Z"
   }, {
      title: "Junior staff numbers and payscales",
      nodeRef: "workspace:\/\/SpacesStore\/6f3deb20-23c6-41b0-b1ce-e3cc2ecd1731",
      creator: {
         forename: "Cynthia",
         surname: "Lawson",
         username: "clawson"
      },
      created: "2013-11-04T04:02:03.000Z",
      modifier: {
         forename: "Steve",
         surname: "Sullivan",
         username: "ssullivan"
      },
      modified: "2014-11-01T07:10:40.000Z"
   }, {
      title: "Premise Licences",
      nodeRef: "workspace:\/\/SpacesStore\/a31ed3e2-a9c0-49be-b222-51e9fd2e4fd7",
      creator: {
         forename: "Brenda",
         surname: "Gardner",
         username: "bgardner"
      },
      created: "2014-05-29T14:25:27.000Z",
      modifier: {
         forename: "Rose",
         surname: "Peterson",
         username: "rpeterson"
      },
      modified: "2015-02-14T06:51:50.000Z"
   }, {
      title: "Compulsory Purchase Orders",
      nodeRef: "workspace:\/\/SpacesStore\/20de2ab0-da16-4a9c-92e6-0abc568f11f3",
      creator: {
         forename: "Paula",
         surname: "Hamilton",
         username: "phamilton"
      },
      created: "2013-12-01T15:31:36.000Z",
      modifier: {
         forename: "Bonnie",
         surname: "Webb",
         username: "bwebb"
      },
      modified: "2015-06-27T00:46:50.000Z"
   }, {
      title: "Senior staff salary data",
      nodeRef: "workspace:\/\/SpacesStore\/5673010f-e9f3-4971-9834-863a62418ee4",
      creator: {
         forename: "Jessica",
         surname: "Spencer",
         username: "jspencer"
      },
      created: "2014-06-02T23:13:02.000Z",
      modifier: {
         forename: "John",
         surname: "Morris",
         username: "jmorris"
      },
      modified: "2015-02-26T05:05:53.000Z"
   }, {
      title: "Example data point",
      nodeRef: "workspace:\/\/SpacesStore\/4eafda69-ad8e-409f-bada-1978c1870620",
      creator: {
         forename: "Heather",
         surname: "Williams",
         username: "hwilliams"
      },
      created: "2014-03-13T14:38:41.000Z",
      modifier: {
         forename: "David",
         surname: "Morales",
         username: "dmorales"
      },
      modified: "2014-09-20T16:50:20.000Z"
   }, {
      title: "Culverts in Devon XML",
      nodeRef: "workspace:\/\/SpacesStore\/3d1ee02f-cb82-4eb5-9d1f-a1a0f0d03e4c",
      creator: {
         forename: "Teresa",
         surname: "Rodriguez",
         username: "trodriguez"
      },
      created: "2014-04-26T22:55:03.000Z",
      modifier: {
         forename: "Elizabeth",
         surname: "Bowman",
         username: "ebowman"
      },
      modified: "2014-11-04T00:05:26.000Z"
   }, {
      title: "GP registered patients",
      nodeRef: "workspace:\/\/SpacesStore\/7d3306d6-2e18-4c6f-adb4-a00f4eee98f9",
      creator: {
         forename: "Paula",
         surname: "Mason",
         username: "pmason"
      },
      created: "2014-07-28T15:23:17.000Z",
      modifier: {
         forename: "Ashley",
         surname: "Butler",
         username: "abutler"
      },
      modified: "2014-12-06T18:52:19.000Z"
   }, {
      title: "East Dorset",
      nodeRef: "workspace:\/\/SpacesStore\/e147d06d-810d-4406-9f0d-3e468b22a6d0",
      creator: {
         forename: "Beverly",
         surname: "Long",
         username: "blong"
      },
      created: "2014-02-22T11:22:53.000Z",
      modifier: {
         forename: "Julie",
         surname: "Rogers",
         username: "jrogers"
      },
      modified: "2015-08-11T14:58:50.000Z"
   }, {
      title: "Customer Feedback and Complaints",
      nodeRef: "workspace:\/\/SpacesStore\/bb2b0498-676d-4687-91eb-6b0a00816b17",
      creator: {
         forename: "David",
         surname: "Butler",
         username: "dbutler"
      },
      created: "2014-04-15T08:59:29.000Z",
      modifier: {
         forename: "Bonnie",
         surname: "Wells",
         username: "bwells"
      },
      modified: "2015-08-05T20:37:38.000Z"
   }, {
      title: "COMAH Sites",
      nodeRef: "workspace:\/\/SpacesStore\/6083692f-2617-457a-916a-46afba9e218c",
      creator: {
         forename: "Ann",
         surname: "Foster",
         username: "afoster"
      },
      created: "2014-02-12T05:07:48.000Z",
      modifier: {
         forename: "Ernest",
         surname: "Bailey",
         username: "ebailey"
      },
      modified: "2015-06-03T11:40:14.000Z"
   }, {
      title: "Azure API",
      nodeRef: "workspace:\/\/SpacesStore\/e3db630a-eda0-4679-be9a-98728b6d4f87",
      creator: {
         forename: "Linda",
         surname: "Thomas",
         username: "lthomas"
      },
      created: "2014-06-07T12:27:35.000Z",
      modifier: {
         forename: "Diana",
         surname: "Walker",
         username: "dwalker"
      },
      modified: "2014-12-31T17:18:44.000Z"
   }, {
      title: "Capital Employed by CPS",
      nodeRef: "workspace:\/\/SpacesStore\/35b9c78d-2a9b-4e65-aac4-46471648207a",
      creator: {
         forename: "Ann",
         surname: "Greene",
         username: "agreene"
      },
      created: "2013-09-25T13:20:05.000Z",
      modifier: {
         forename: "Albert",
         surname: "Ryan",
         username: "aryan"
      },
      modified: "2014-11-30T03:49:33.000Z"
   }, {
      title: "Operator licence holders Wales",
      nodeRef: "workspace:\/\/SpacesStore\/2027d8e9-44b1-40bf-8d8c-441c034ee1f8",
      creator: {
         forename: "Benjamin",
         surname: "Gibson",
         username: "bgibson"
      },
      created: "2014-07-29T14:08:07.000Z",
      modifier: {
         forename: "Cynthia",
         surname: "Morrison",
         username: "cmorrison"
      },
      modified: "2015-07-20T08:05:34.000Z"
   }, {
      title: "Social Incubator North website",
      nodeRef: "workspace:\/\/SpacesStore\/8ddb608a-d06b-4a28-a8ae-6aff4a572a7c",
      creator: {
         forename: "Martha",
         surname: "Peterson",
         username: "mpeterson"
      },
      created: "2013-12-16T21:28:08.000Z",
      modifier: {
         forename: "Lori",
         surname: "Martinez",
         username: "lmartinez"
      },
      modified: "2014-12-07T19:14:53.000Z"
   }, {
      title: "Homelessness Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/aaa568ee-a95f-4eac-8ccf-1d460cc42a62",
      creator: {
         forename: "Doris",
         surname: "Porter",
         username: "dporter"
      },
      created: "2013-11-07T01:24:14.000Z",
      modifier: {
         forename: "Scott",
         surname: "Evans",
         username: "sevans"
      },
      modified: "2014-12-17T01:28:58.000Z"
   }, {
      title: "Settlement Boundaries",
      nodeRef: "workspace:\/\/SpacesStore\/684f4f91-6867-4294-bf48-7f77825d0f69",
      creator: {
         forename: "Nancy",
         surname: "Hawkins",
         username: "nhawkins"
      },
      created: "2014-07-21T05:28:41.000Z",
      modifier: {
         forename: "Irene",
         surname: "Kelly",
         username: "ikelly"
      },
      modified: "2015-02-06T09:18:09.000Z"
   }, {
      title: "NPCA Organisational audit surveys",
      nodeRef: "workspace:\/\/SpacesStore\/4575be66-2a3c-4794-afc2-6f483076fdd0",
      creator: {
         forename: "Julie",
         surname: "Griffin",
         username: "jgriffin"
      },
      created: "2014-02-02T23:21:26.000Z",
      modifier: {
         forename: "John",
         surname: "Carpenter",
         username: "jcarpenter"
      },
      modified: "2014-09-16T08:38:48.000Z"
   }, {
      title: "Road traffic accidents",
      nodeRef: "workspace:\/\/SpacesStore\/d42c4d13-65da-4832-b7ed-4ba3a5292779",
      creator: {
         forename: "Rose",
         surname: "Frazier",
         username: "rfrazier"
      },
      created: "2014-04-09T18:47:42.000Z",
      modifier: {
         forename: "Douglas",
         surname: "Andrews",
         username: "dandrews"
      },
      modified: "2015-05-19T02:21:18.000Z"
   }, {
      title: "Expenditure Information",
      nodeRef: "workspace:\/\/SpacesStore\/e851ff25-4b7a-4619-aabb-0189dceaeb43",
      creator: {
         forename: "Bruce",
         surname: "Jenkins",
         username: "bjenkins"
      },
      created: "2013-09-17T00:59:32.000Z",
      modifier: {
         forename: "Marilyn",
         surname: "Martin",
         username: "mmartin"
      },
      modified: "2015-03-15T21:48:37.000Z"
   }, {
      title: "Pharmacy dispensaries",
      nodeRef: "workspace:\/\/SpacesStore\/52c4cdef-bd7b-417b-aa33-8304d5410b64",
      creator: {
         forename: "Aaron",
         surname: "Richardson",
         username: "arichardson"
      },
      created: "2014-08-01T07:13:31.000Z",
      modifier: {
         forename: "Shirley",
         surname: "Rogers",
         username: "srogers"
      },
      modified: "2015-03-07T12:46:15.000Z"
   }, {
      title: "Adult establishment licences",
      nodeRef: "workspace:\/\/SpacesStore\/1f61f626-75a3-4448-9d24-63b5cd808f23",
      creator: {
         forename: "Jennifer",
         surname: "Mason",
         username: "jmason"
      },
      created: "2013-11-18T07:56:25.000Z",
      modifier: {
         forename: "Harold",
         surname: "Bell",
         username: "hbell"
      },
      modified: "2015-08-13T23:47:09.000Z"
   }, {
      title: "Archived GP practices",
      nodeRef: "workspace:\/\/SpacesStore\/1472df5a-5770-48ee-bef2-01281bb7613d",
      creator: {
         forename: "Ryan",
         surname: "Mason",
         username: "rmason"
      },
      created: "2014-01-03T06:09:56.000Z",
      modifier: {
         forename: "William",
         surname: "Grant",
         username: "wgrant"
      },
      modified: "2015-06-18T21:46:37.000Z"
   }, {
      title: "Financial instruments",
      nodeRef: "workspace:\/\/SpacesStore\/854bf4cf-2341-49fe-ad53-334efe66bd6b",
      creator: {
         forename: "Willie",
         surname: "Williamson",
         username: "wwilliamson"
      },
      created: "2014-01-13T18:46:13.000Z",
      modifier: {
         forename: "Sean",
         surname: "Mills",
         username: "smills"
      },
      modified: "2014-08-22T00:26:23.000Z"
   }, {
      title: "Metadata tables",
      nodeRef: "workspace:\/\/SpacesStore\/3a3def34-707b-4c24-9589-5c7c7f261df8",
      creator: {
         forename: "Janet",
         surname: "Evans",
         username: "jevans"
      },
      created: "2014-07-21T20:50:51.000Z",
      modifier: {
         forename: "Melissa",
         surname: "Frazier",
         username: "mfrazier"
      },
      modified: "2015-06-12T18:40:25.000Z"
   }, {
      title: "The National Pain Audit Data Description File",
      nodeRef: "workspace:\/\/SpacesStore\/de511aa7-bb1a-4425-be3e-a4d4193d02dd",
      creator: {
         forename: "Victor",
         surname: "Ramos",
         username: "vramos"
      },
      created: "2014-03-12T12:03:14.000Z",
      modifier: {
         forename: "Terry",
         surname: "Chapman",
         username: "tchapman"
      },
      modified: "2015-05-15T05:41:29.000Z"
   }, {
      title: "Contract Register Metadata",
      nodeRef: "workspace:\/\/SpacesStore\/69235107-f1ea-4fb9-94f4-32aec8a83895",
      creator: {
         forename: "Jonathan",
         surname: "Reynolds",
         username: "jreynolds"
      },
      created: "2013-12-04T06:08:41.000Z",
      modifier: {
         forename: "Barbara",
         surname: "Bradley",
         username: "bbradley"
      },
      modified: "2015-02-25T17:55:08.000Z"
   }, {
      title: "Council housing stock",
      nodeRef: "workspace:\/\/SpacesStore\/5c6cb82a-6dd0-400b-b6d3-5f39aed81a8f",
      creator: {
         forename: "Bonnie",
         surname: "Gonzalez",
         username: "bgonzalez"
      },
      created: "2013-10-26T04:11:22.000Z",
      modifier: {
         forename: "Roger",
         surname: "Fuller",
         username: "rfuller"
      },
      modified: "2014-09-26T00:02:03.000Z"
   }, {
      title: "Medical and Dental Staff",
      nodeRef: "workspace:\/\/SpacesStore\/d5a992f2-b2ff-4316-8738-33f093b1af89",
      creator: {
         forename: "Cynthia",
         surname: "Cox",
         username: "ccox"
      },
      created: "2013-10-15T13:40:32.000Z",
      modifier: {
         forename: "Steve",
         surname: "Murphy",
         username: "smurphy"
      },
      modified: "2015-03-20T22:41:33.000Z"
   }, {
      title: "CTIL mobile csv dataset",
      nodeRef: "workspace:\/\/SpacesStore\/8cfe954c-856d-46e1-8924-cfab1ab00666",
      creator: {
         forename: "Aaron",
         surname: "Howard",
         username: "ahoward"
      },
      created: "2014-02-08T23:47:59.000Z",
      modifier: {
         forename: "Julie",
         surname: "Nichols",
         username: "jnichols"
      },
      modified: "2015-02-03T09:18:22.000Z"
   }, {
      title: "Private Controlled Drug Prescribers",
      nodeRef: "workspace:\/\/SpacesStore\/7b847708-b576-4223-bcfa-5ded5cfc7742",
      creator: {
         forename: "Linda",
         surname: "Burke",
         username: "lburke"
      },
      created: "2014-06-28T18:03:28.000Z",
      modifier: {
         forename: "Jimmy",
         surname: "Gray",
         username: "jgray"
      },
      modified: "2014-09-07T00:16:50.000Z"
   }, {
      title: "PLACE data",
      nodeRef: "workspace:\/\/SpacesStore\/930ac858-863d-42b0-b0aa-a2191a275eb9",
      creator: {
         forename: "Timothy",
         surname: "Snyder",
         username: "tsnyder"
      },
      created: "2014-05-10T10:11:32.000Z",
      modifier: {
         forename: "Jimmy",
         surname: "Rice",
         username: "jrice"
      },
      modified: "2015-03-24T07:16:06.000Z"
   }, {
      title: "External appointments by gender",
      nodeRef: "workspace:\/\/SpacesStore\/4e22c392-6e12-41c2-aa01-500b88ac17d6",
      creator: {
         forename: "Laura",
         surname: "Lane",
         username: "llane"
      },
      created: "2014-06-09T18:47:12.000Z",
      modifier: {
         forename: "Earl",
         surname: "Fields",
         username: "efields"
      },
      modified: "2015-04-22T08:43:27.000Z"
   }, {
      title: "Default Organisation Codes",
      nodeRef: "workspace:\/\/SpacesStore\/38bf40c9-6595-4108-84ce-0ff2178b5407",
      creator: {
         forename: "Frank",
         surname: "Reed",
         username: "freed"
      },
      created: "2014-06-10T01:32:03.000Z",
      modifier: {
         forename: "Joan",
         surname: "Matthews",
         username: "jmatthews"
      },
      modified: "2014-10-13T12:20:19.000Z"
   }, {
      title: "Performance data",
      nodeRef: "workspace:\/\/SpacesStore\/16965973-d160-4f2c-9047-c507b1418944",
      creator: {
         forename: "Carl",
         surname: "Hicks",
         username: "chicks"
      },
      created: "2014-04-23T12:38:11.000Z",
      modifier: {
         forename: "Jeremy",
         surname: "Garrett",
         username: "jgarrett"
      },
      modified: "2014-09-14T06:21:44.000Z"
   }, {
      title: "SCS salaries",
      nodeRef: "workspace:\/\/SpacesStore\/656b482b-42e3-4713-8113-ac32765117e7",
      creator: {
         forename: "John",
         surname: "Fowler",
         username: "jfowler"
      },
      created: "2013-10-20T16:11:44.000Z",
      modifier: {
         forename: "Charles",
         surname: "Howell",
         username: "chowell"
      },
      modified: "2015-03-18T20:15:38.000Z"
   }, {
      title: "St Albans City",
      nodeRef: "workspace:\/\/SpacesStore\/7cac02c5-8454-457b-9a92-1653d12721e8",
      creator: {
         forename: "Eric",
         surname: "Thomas",
         username: "ethomas"
      },
      created: "2013-10-01T09:42:18.000Z",
      modifier: {
         forename: "Theresa",
         surname: "Williamson",
         username: "twilliamson"
      },
      modified: "2015-07-15T22:42:45.000Z"
   }, {
      title: "Quality of estuaries",
      nodeRef: "workspace:\/\/SpacesStore\/edbe0e78-e625-4a6c-a3c1-56e649ef844e",
      creator: {
         forename: "Alice",
         surname: "Parker",
         username: "aparker"
      },
      created: "2014-08-03T18:43:31.000Z",
      modifier: {
         forename: "Randy",
         surname: "Henry",
         username: "rhenry"
      },
      modified: "2014-09-28T22:50:13.000Z"
   }, {
      title: "Isle of Wight",
      nodeRef: "workspace:\/\/SpacesStore\/78dcbb37-a307-48f5-ab9f-f9c79a6d3f2d",
      creator: {
         forename: "Karen",
         surname: "Flores",
         username: "kflores"
      },
      created: "2013-12-23T19:21:36.000Z",
      modifier: {
         forename: "Jose",
         surname: "Little",
         username: "jlittle"
      },
      modified: "2015-05-15T23:47:39.000Z"
   }, {
      title: "Offroad Cycle Routes KML",
      nodeRef: "workspace:\/\/SpacesStore\/dde12286-b002-419a-aae0-99037cc9893d",
      creator: {
         forename: "Arthur",
         surname: "James",
         username: "ajames"
      },
      created: "2014-03-19T03:44:28.000Z",
      modifier: {
         forename: "Ruth",
         surname: "Parker",
         username: "rparker"
      },
      modified: "2015-08-03T10:36:07.000Z"
   }, {
      title: "Disciplinary cases by religion",
      nodeRef: "workspace:\/\/SpacesStore\/ccb10d14-1990-4e9e-916a-7f0f2f913aee",
      creator: {
         forename: "Dorothy",
         surname: "Collins",
         username: "dcollins"
      },
      created: "2014-06-09T03:35:04.000Z",
      modifier: {
         forename: "Wanda",
         surname: "Warren",
         username: "wwarren"
      },
      modified: "2015-06-16T06:45:06.000Z"
   }, {
      title: "SSNAP Data Transparency webpage",
      nodeRef: "workspace:\/\/SpacesStore\/8660afd7-0bb3-4092-8acf-d842f7978d99",
      creator: {
         forename: "Timothy",
         surname: "Coleman",
         username: "tcoleman"
      },
      created: "2014-02-14T22:01:37.000Z",
      modifier: {
         forename: "Roy",
         surname: "Green",
         username: "rgreen"
      },
      modified: "2015-01-22T13:11:19.000Z"
   }, {
      title: "Public Conveniences Milton Keynes",
      nodeRef: "workspace:\/\/SpacesStore\/b4afb441-ab2e-44c6-a17e-8b3d713a9e80",
      creator: {
         forename: "Charles",
         surname: "Diaz",
         username: "cdiaz"
      },
      created: "2014-06-21T20:38:10.000Z",
      modifier: {
         forename: "Bonnie",
         surname: "Kennedy",
         username: "bkennedy"
      },
      modified: "2015-01-19T20:23:37.000Z"
   }, {
      title: "Link to licence register",
      nodeRef: "workspace:\/\/SpacesStore\/96e36865-51c1-42c3-a102-2b0390a6b2b4",
      creator: {
         forename: "Joseph",
         surname: "Gonzalez",
         username: "jgonzalez"
      },
      created: "2014-04-01T22:44:22.000Z",
      modifier: {
         forename: "Evelyn",
         surname: "Scott",
         username: "escott"
      },
      modified: "2014-12-11T23:12:29.000Z"
   }, {
      title: "Digital Radio Reports",
      nodeRef: "workspace:\/\/SpacesStore\/7c88a17f-a9c5-4ad3-9ef5-ab1cfd04c371",
      creator: {
         forename: "Christopher",
         surname: "Johnson",
         username: "cjohnson"
      },
      created: "2013-12-18T11:01:45.000Z",
      modifier: {
         forename: "Michael",
         surname: "Coleman",
         username: "mcoleman"
      },
      modified: "2015-08-10T21:30:28.000Z"
   }, {
      title: "Current Tenanted Housing Stock",
      nodeRef: "workspace:\/\/SpacesStore\/ea1a514c-d5a3-4358-a461-b17768ac11b3",
      creator: {
         forename: "Barbara",
         surname: "Vasquez",
         username: "bvasquez"
      },
      created: "2013-11-29T03:42:08.000Z",
      modifier: {
         forename: "Patrick",
         surname: "Cox",
         username: "pcox"
      },
      modified: "2015-07-17T16:27:26.000Z"
   }, {
      title: "Google Analytics website",
      nodeRef: "workspace:\/\/SpacesStore\/3d798559-a056-4385-bff9-1d67347e7f20",
      creator: {
         forename: "Jesse",
         surname: "Fernandez",
         username: "jfernandez"
      },
      created: "2014-05-23T04:48:24.000Z",
      modifier: {
         forename: "Craig",
         surname: "Ray",
         username: "cray"
      },
      modified: "2015-01-05T19:49:20.000Z"
   }, {
      title: "Junior staff posts",
      nodeRef: "workspace:\/\/SpacesStore\/367f5d15-4012-46e1-9703-4b092270ecb5",
      creator: {
         forename: "Cheryl",
         surname: "Watson",
         username: "cwatson"
      },
      created: "2013-12-25T21:53:05.000Z",
      modifier: {
         forename: "Bobby",
         surname: "Morris",
         username: "bmorris"
      },
      modified: "2014-10-25T09:51:16.000Z"
   }, {
      title: "Guidance  on Format",
      nodeRef: "workspace:\/\/SpacesStore\/9b1157a9-141b-47cb-9585-2c71cc0f83aa",
      creator: {
         forename: "Deborah",
         surname: "Schmidt",
         username: "dschmidt"
      },
      created: "2013-12-02T20:56:20.000Z",
      modifier: {
         forename: "Alan",
         surname: "Turner",
         username: "aturner"
      },
      modified: "2015-07-27T01:05:04.000Z"
   }, {
      title: "Health Visitors",
      nodeRef: "workspace:\/\/SpacesStore\/1c106e89-21dc-4272-ba2d-0ed9afc3215d",
      creator: {
         forename: "Antonio",
         surname: "Spencer",
         username: "aspencer"
      },
      created: "2013-09-22T22:57:16.000Z",
      modifier: {
         forename: "Phyllis",
         surname: "Sullivan",
         username: "psullivan"
      },
      modified: "2014-11-12T11:34:32.000Z"
   }, {
      title: "NHS Sickness Absence Rates",
      nodeRef: "workspace:\/\/SpacesStore\/61862a97-5e69-4a4c-900d-3e0d1011cea1",
      creator: {
         forename: "Helen",
         surname: "Matthews",
         username: "hmatthews"
      },
      created: "2013-12-16T03:25:09.000Z",
      modifier: {
         forename: "Jacqueline",
         surname: "Gilbert",
         username: "jgilbert"
      },
      modified: "2015-05-08T10:11:12.000Z"
   }, {
      title: "NNAP Project website",
      nodeRef: "workspace:\/\/SpacesStore\/7003e5ec-aea6-4468-94f5-d5589dc79eda",
      creator: {
         forename: "Nicole",
         surname: "Gonzalez",
         username: "ngonzalez"
      },
      created: "2014-02-23T09:00:27.000Z",
      modifier: {
         forename: "Stephen",
         surname: "Perez",
         username: "sperez"
      },
      modified: "2015-03-26T17:51:04.000Z"
   }, {
      title: "Pollution Incidents Sumary",
      nodeRef: "workspace:\/\/SpacesStore\/abb06e2e-801f-43de-9cf6-b722eb327ba1",
      creator: {
         forename: "Barbara",
         surname: "Ruiz",
         username: "bruiz"
      },
      created: "2014-02-26T23:08:39.000Z",
      modifier: {
         forename: "Pamela",
         surname: "Myers",
         username: "pmyers"
      },
      modified: "2015-07-07T18:06:16.000Z"
   }, {
      title: "Council Property Portfolio",
      nodeRef: "workspace:\/\/SpacesStore\/77acc9a8-b9d6-45df-aa07-55074871b812",
      creator: {
         forename: "Joshua",
         surname: "Stephens",
         username: "jstephens"
      },
      created: "2013-10-16T09:06:53.000Z",
      modifier: {
         forename: "Stephanie",
         surname: "Taylor",
         username: "staylor"
      },
      modified: "2015-05-09T16:52:14.000Z"
   }, {
      title: "Comparative satisfaction data",
      nodeRef: "workspace:\/\/SpacesStore\/0a9d4b82-520e-466b-a36a-b1f17f36e403",
      creator: {
         forename: "Carol",
         surname: "Lee",
         username: "clee"
      },
      created: "2013-12-28T21:39:19.000Z",
      modifier: {
         forename: "Lori",
         surname: "Jones",
         username: "ljones"
      },
      modified: "2015-08-12T15:47:10.000Z"
   }, {
      title: "Contracts Finder",
      nodeRef: "workspace:\/\/SpacesStore\/ba8c2d24-2c5a-4555-8361-7c9713730507",
      creator: {
         forename: "Dennis",
         surname: "Gibson",
         username: "dgibson"
      },
      created: "2013-12-28T15:44:45.000Z",
      modifier: {
         forename: "Anthony",
         surname: "Pierce",
         username: "apierce"
      },
      modified: "2015-06-09T06:45:19.000Z"
   }, {
      title: "Headline Percentiles",
      nodeRef: "workspace:\/\/SpacesStore\/63db6473-5d7c-4151-b398-2b22afc3f5f7",
      creator: {
         forename: "Donald",
         surname: "Freeman",
         username: "dfreeman"
      },
      created: "2013-09-19T23:14:03.000Z",
      modifier: {
         forename: "Cheryl",
         surname: "Hayes",
         username: "chayes"
      },
      modified: "2014-11-24T08:43:45.000Z"
   }, {
      title: "Planning Applications Schema",
      nodeRef: "workspace:\/\/SpacesStore\/f0c924aa-e206-4ca7-9bd1-c68f2a24b9a8",
      creator: {
         forename: "Douglas",
         surname: "Wells",
         username: "dwells"
      },
      created: "2014-05-26T03:50:58.000Z",
      modifier: {
         forename: "Jason",
         surname: "Sims",
         username: "jsims"
      },
      modified: "2015-03-22T14:54:34.000Z"
   }, {
      title: "Staff of Social Services",
      nodeRef: "workspace:\/\/SpacesStore\/84c02331-48e9-4a29-8793-8bcf2d4ccd6e",
      creator: {
         forename: "Walter",
         surname: "Stevens",
         username: "wstevens"
      },
      created: "2014-07-16T03:00:56.000Z",
      modifier: {
         forename: "Craig",
         surname: "Ross",
         username: "cross"
      },
      modified: "2014-08-28T19:37:13.000Z"
   }, {
      title: "Archived Info",
      nodeRef: "workspace:\/\/SpacesStore\/f34b66c8-f0b9-44b6-b51a-d2d6a81c5261",
      creator: {
         forename: "Phillip",
         surname: "Hayes",
         username: "phayes"
      },
      created: "2014-02-14T00:08:37.000Z",
      modifier: {
         forename: "Shirley",
         surname: "Webb",
         username: "swebb"
      },
      modified: "2015-05-29T07:39:37.000Z"
   }, {
      title: "Public Health Funerals",
      nodeRef: "workspace:\/\/SpacesStore\/e4901b56-af19-4851-af8e-661aee986089",
      creator: {
         forename: "Patricia",
         surname: "Howell",
         username: "phowell"
      },
      created: "2014-03-26T03:03:44.000Z",
      modifier: {
         forename: "Annie",
         surname: "Wheeler",
         username: "awheeler"
      },
      modified: "2015-05-01T06:44:32.000Z"
   }, {
      title: "North Yorkshire",
      nodeRef: "workspace:\/\/SpacesStore\/34850722-f724-4c8d-a663-3d9e44913107",
      creator: {
         forename: "Martha",
         surname: "Little",
         username: "mlittle"
      },
      created: "2014-05-08T00:08:55.000Z",
      modifier: {
         forename: "Victor",
         surname: "Henderson",
         username: "vhenderson"
      },
      modified: "2015-01-19T05:56:37.000Z"
   }, {
      title: "Freshwater and Marine Biological Surveys England",
      nodeRef: "workspace:\/\/SpacesStore\/d7960f86-115b-4a4d-9f35-9a8c503668cf",
      creator: {
         forename: "Debra",
         surname: "Olson",
         username: "dolson"
      },
      created: "2014-07-02T06:10:01.000Z",
      modifier: {
         forename: "Irene",
         surname: "Snyder",
         username: "isnyder"
      },
      modified: "2015-03-29T06:04:21.000Z"
   }, {
      title: "CSV metadata",
      nodeRef: "workspace:\/\/SpacesStore\/ef73da33-8d36-44e3-b6ff-a757a34bc360",
      creator: {
         forename: "Frank",
         surname: "Spencer",
         username: "fspencer"
      },
      created: "2013-11-02T06:57:31.000Z",
      modifier: {
         forename: "Henry",
         surname: "Wallace",
         username: "hwallace"
      },
      modified: "2014-08-23T13:49:29.000Z"
   }, {
      title: "Senior staff datasets",
      nodeRef: "workspace:\/\/SpacesStore\/1146d013-fee3-4b0e-8efb-ae51bc7ed5e1",
      creator: {
         forename: "Virginia",
         surname: "Lane",
         username: "vlane"
      },
      created: "2014-03-06T12:49:45.000Z",
      modifier: {
         forename: "Julia",
         surname: "Allen",
         username: "jallen"
      },
      modified: "2015-03-24T20:12:53.000Z"
   }, {
      title: "Glossary of terms used",
      nodeRef: "workspace:\/\/SpacesStore\/f71b733e-21a7-4f40-b24f-0804894f6879",
      creator: {
         forename: "Billy",
         surname: "Richards",
         username: "brichards"
      },
      created: "2014-06-24T13:31:16.000Z",
      modifier: {
         forename: "Teresa",
         surname: "Mendoza",
         username: "tmendoza"
      },
      modified: "2015-04-06T23:47:11.000Z"
   }, {
      title: "Data Dictonary",
      nodeRef: "workspace:\/\/SpacesStore\/b01b3961-ac3c-480a-b5a0-b5eb8ccbfc93",
      creator: {
         forename: "Edward",
         surname: "Mitchell",
         username: "emitchell"
      },
      created: "2014-03-25T17:28:28.000Z",
      modifier: {
         forename: "Ashley",
         surname: "Dixon",
         username: "adixon"
      },
      modified: "2015-03-12T15:19:45.000Z"
   }, {
      title: "Bracknell Forest",
      nodeRef: "workspace:\/\/SpacesStore\/b0ab6026-5c7f-4ac7-8006-781a02e5cc0e",
      creator: {
         forename: "Bonnie",
         surname: "James",
         username: "bjames"
      },
      created: "2014-04-30T20:37:19.000Z",
      modifier: {
         forename: "Tammy",
         surname: "Gilbert",
         username: "tgilbert"
      },
      modified: "2015-02-20T03:02:17.000Z"
   }, {
      title: "Election results",
      nodeRef: "workspace:\/\/SpacesStore\/9ea6aa68-36ea-4168-b4d8-8d374a0e3f27",
      creator: {
         forename: "Julia",
         surname: "Ramos",
         username: "jramos"
      },
      created: "2014-04-10T22:47:01.000Z",
      modifier: {
         forename: "Willie",
         surname: "Clark",
         username: "wclark"
      },
      modified: "2015-07-23T18:49:28.000Z"
   }, {
      title: "Plymouth Public Toilets",
      nodeRef: "workspace:\/\/SpacesStore\/c2cc2c97-c365-4403-bdbf-2fe784dd1835",
      creator: {
         forename: "James",
         surname: "Reyes",
         username: "jreyes"
      },
      created: "2014-06-08T23:05:39.000Z",
      modifier: {
         forename: "Steven",
         surname: "Williamson",
         username: "swilliamson"
      },
      modified: "2014-09-23T01:01:22.000Z"
   }, {
      title: "Deprivation of Liberty Safeguards",
      nodeRef: "workspace:\/\/SpacesStore\/dbb58370-efb2-46fa-8447-e0b990243400",
      creator: {
         forename: "Diana",
         surname: "Harris",
         username: "dharris"
      },
      created: "2013-11-21T02:21:42.000Z",
      modifier: {
         forename: "Sharon",
         surname: "Reid",
         username: "sreid"
      },
      modified: "2015-02-09T18:57:16.000Z"
   }, {
      title: "ArcGIS Service Directory",
      nodeRef: "workspace:\/\/SpacesStore\/94eabe9c-7656-41cc-9e6e-cc4d9a3ca8ae",
      creator: {
         forename: "Jerry",
         surname: "Hansen",
         username: "jhansen"
      },
      created: "2014-08-06T14:44:47.000Z",
      modifier: {
         forename: "Antonio",
         surname: "Gonzalez",
         username: "agonzalez"
      },
      modified: "2014-11-03T20:00:44.000Z"
   }, {
      title: "Public perceptions",
      nodeRef: "workspace:\/\/SpacesStore\/4c035fb5-a460-4d78-82e4-381a96a69978",
      creator: {
         forename: "Tina",
         surname: "Olson",
         username: "tolson"
      },
      created: "2014-02-05T11:42:38.000Z",
      modifier: {
         forename: "Frances",
         surname: "Reid",
         username: "freid"
      },
      modified: "2015-07-25T16:11:26.000Z"
   }, {
      title: "Car Leasehold",
      nodeRef: "workspace:\/\/SpacesStore\/6e519de0-5579-4462-85fd-18eb74401b4e",
      creator: {
         forename: "Ryan",
         surname: "Lawrence",
         username: "rlawrence"
      },
      created: "2014-06-26T16:53:25.000Z",
      modifier: {
         forename: "Theresa",
         surname: "Adams",
         username: "tadams"
      },
      modified: "2014-12-14T10:09:44.000Z"
   }, {
      title: "DBS upheld and not upheld dispute volumes",
      nodeRef: "workspace:\/\/SpacesStore\/bb5a1ce3-b55a-4845-9e45-94ce99b4b936",
      creator: {
         forename: "Joshua",
         surname: "Turner",
         username: "jturner"
      },
      created: "2013-09-01T01:45:23.000Z",
      modifier: {
         forename: "Dorothy",
         surname: "Williams",
         username: "dwilliams"
      },
      modified: "2014-09-22T20:51:10.000Z"
   }, {
      title: "Ethnicity Percentiles",
      nodeRef: "workspace:\/\/SpacesStore\/862e6aa7-dbc1-4e94-9a9d-f069dba3ac61",
      creator: {
         forename: "Lois",
         surname: "Wright",
         username: "lwright"
      },
      created: "2014-03-09T03:30:26.000Z",
      modifier: {
         forename: "Ann",
         surname: "Willis",
         username: "awillis"
      },
      modified: "2015-06-06T13:51:57.000Z"
   }, {
      title: "Northamtonshire Butterfly Records",
      nodeRef: "workspace:\/\/SpacesStore\/b9433330-cfc4-4844-b744-d889356e3523",
      creator: {
         forename: "Gary",
         surname: "Perry",
         username: "gperry"
      },
      created: "2013-11-09T23:20:21.000Z",
      modifier: {
         forename: "Katherine",
         surname: "Willis",
         username: "kwillis"
      },
      modified: "2014-11-27T06:37:06.000Z"
   }, {
      title: "Appointments by religion",
      nodeRef: "workspace:\/\/SpacesStore\/fc446092-615b-4a23-a18d-31ffb3187a04",
      creator: {
         forename: "Nancy",
         surname: "Weaver",
         username: "nweaver"
      },
      created: "2014-04-16T18:42:36.000Z",
      modifier: {
         forename: "Richard",
         surname: "Parker",
         username: "rparker"
      },
      modified: "2014-11-11T16:32:20.000Z"
   }, {
      title: "Statement of financial position",
      nodeRef: "workspace:\/\/SpacesStore\/2b75230c-4401-4196-afcb-9e7f39712290",
      creator: {
         forename: "Martin",
         surname: "Phillips",
         username: "mphillips"
      },
      created: "2013-10-06T06:34:26.000Z",
      modifier: {
         forename: "Joyce",
         surname: "Davis",
         username: "jdavis"
      },
      modified: "2014-09-17T16:18:30.000Z"
   }, {
      title: "Mid Devon",
      nodeRef: "workspace:\/\/SpacesStore\/fe6be7a8-f34b-4cd9-bcbf-7a8e6557c07e",
      creator: {
         forename: "Joseph",
         surname: "Davis",
         username: "jdavis"
      },
      created: "2014-04-06T09:59:30.000Z",
      modifier: {
         forename: "Roy",
         surname: "Davis",
         username: "rdavis"
      },
      modified: "2015-04-11T16:13:07.000Z"
   }, {
      title: "Web Page",
      nodeRef: "workspace:\/\/SpacesStore\/2b90f761-3fc1-4f68-9833-b7ff3bffed6c",
      creator: {
         forename: "William",
         surname: "Sanchez",
         username: "wsanchez"
      },
      created: "2014-02-18T02:51:53.000Z",
      modifier: {
         forename: "Cheryl",
         surname: "Oliver",
         username: "coliver"
      },
      modified: "2014-09-24T18:23:56.000Z"
   }, {
      title: "Pay multiples",
      nodeRef: "workspace:\/\/SpacesStore\/42f1f4b3-5b0d-4bdc-844a-ebf400d9d15c",
      creator: {
         forename: "Lois",
         surname: "Stone",
         username: "lstone"
      },
      created: "2013-09-05T14:42:49.000Z",
      modifier: {
         forename: "Alan",
         surname: "Smith",
         username: "asmith"
      },
      modified: "2015-05-24T03:57:13.000Z"
   }, {
      title: "Spring Index",
      nodeRef: "workspace:\/\/SpacesStore\/356252de-f4e4-44f4-ae75-2e4ae7c2e37a",
      creator: {
         forename: "Ruby",
         surname: "Schmidt",
         username: "rschmidt"
      },
      created: "2013-12-23T13:26:05.000Z",
      modifier: {
         forename: "Edward",
         surname: "Diaz",
         username: "ediaz"
      },
      modified: "2014-12-23T15:58:32.000Z"
   }, {
      title: "Leicester City",
      nodeRef: "workspace:\/\/SpacesStore\/c52e7e32-4f92-4e74-a4d7-0f3ebfbf702b",
      creator: {
         forename: "Arthur",
         surname: "Thomas",
         username: "athomas"
      },
      created: "2014-06-13T23:20:49.000Z",
      modifier: {
         forename: "Benjamin",
         surname: "Lopez",
         username: "blopez"
      },
      modified: "2014-09-28T10:27:11.000Z"
   }, {
      title: "External appointments by age",
      nodeRef: "workspace:\/\/SpacesStore\/9fd4b5ee-b35a-4647-80c0-e72591813524",
      creator: {
         forename: "Stephanie",
         surname: "Grant",
         username: "sgrant"
      },
      created: "2014-03-30T22:09:14.000Z",
      modifier: {
         forename: "Harold",
         surname: "Bryant",
         username: "hbryant"
      },
      modified: "2014-08-23T18:45:22.000Z"
   }, {
      title: "Data Definitions",
      nodeRef: "workspace:\/\/SpacesStore\/654398fd-1173-465a-b1fe-c657bfa10e9f",
      creator: {
         forename: "Heather",
         surname: "Riley",
         username: "hriley"
      },
      created: "2014-07-08T12:54:09.000Z",
      modifier: {
         forename: "Roger",
         surname: "Gilbert",
         username: "rgilbert"
      },
      modified: "2014-09-12T08:20:09.000Z"
   }, {
      title: "NHS IC Senior Staff Data",
      nodeRef: "workspace:\/\/SpacesStore\/235a1c4d-b922-469d-9495-0208aeeea690",
      creator: {
         forename: "Diana",
         surname: "Cooper",
         username: "dcooper"
      },
      created: "2013-09-05T00:47:58.000Z",
      modifier: {
         forename: "Brandon",
         surname: "Johnston",
         username: "bjohnston"
      },
      modified: "2015-02-20T01:00:39.000Z"
   }, {
      title: "CycleNetXChange Background",
      nodeRef: "workspace:\/\/SpacesStore\/1e232d73-0613-46a2-8f6d-c9536dcd4a00",
      creator: {
         forename: "Aaron",
         surname: "Ramos",
         username: "aramos"
      },
      created: "2013-09-15T13:39:38.000Z",
      modifier: {
         forename: "Janice",
         surname: "Greene",
         username: "jgreene"
      },
      modified: "2014-11-19T10:49:56.000Z"
   }, {
      title: "Lottery Grants search",
      nodeRef: "workspace:\/\/SpacesStore\/692e4b48-3a6c-4aae-8c96-d97feaa052ff",
      creator: {
         forename: "Clarence",
         surname: "Arnold",
         username: "carnold"
      },
      created: "2013-12-29T21:59:11.000Z",
      modifier: {
         forename: "Rachel",
         surname: "Ruiz",
         username: "rruiz"
      },
      modified: "2015-05-31T10:44:53.000Z"
   }, {
      title: "Highway Schemes",
      nodeRef: "workspace:\/\/SpacesStore\/39db1237-d521-4702-a8e6-cac4ea85b184",
      creator: {
         forename: "Harold",
         surname: "Carr",
         username: "hcarr"
      },
      created: "2014-01-27T22:00:52.000Z",
      modifier: {
         forename: "Bruce",
         surname: "Freeman",
         username: "bfreeman"
      },
      modified: "2015-07-24T09:24:03.000Z"
   }, {
      title: "National crime recording standard",
      nodeRef: "workspace:\/\/SpacesStore\/bb7160ea-f82d-4b26-b399-d53a5b186706",
      creator: {
         forename: "Frances",
         surname: "Taylor",
         username: "ftaylor"
      },
      created: "2013-12-24T12:17:30.000Z",
      modifier: {
         forename: "Aaron",
         surname: "Larson",
         username: "alarson"
      },
      modified: "2014-10-07T10:34:21.000Z"
   }, {
      title: "NHS Occupation Codes",
      nodeRef: "workspace:\/\/SpacesStore\/7611aa32-4148-4781-bb4d-3344470ac222",
      creator: {
         forename: "Eric",
         surname: "Alvarez",
         username: "ealvarez"
      },
      created: "2013-09-13T08:31:04.000Z",
      modifier: {
         forename: "Donald",
         surname: "Porter",
         username: "dporter"
      },
      modified: "2014-10-11T23:44:01.000Z"
   }, {
      title: "National Archives Onsite Satisfaction",
      nodeRef: "workspace:\/\/SpacesStore\/9759dbb3-6901-488b-8abb-18b1679a1877",
      creator: {
         forename: "Eugene",
         surname: "Welch",
         username: "ewelch"
      },
      created: "2014-06-17T19:03:14.000Z",
      modifier: {
         forename: "Todd",
         surname: "Rogers",
         username: "trogers"
      },
      modified: "2015-03-12T09:03:39.000Z"
   }, {
      title: "The National Pain Audit Data File",
      nodeRef: "workspace:\/\/SpacesStore\/fc421ac6-9ed6-41ea-a864-7e812ef6a534",
      creator: {
         forename: "Martha",
         surname: "Mills",
         username: "mmills"
      },
      created: "2014-03-05T23:54:30.000Z",
      modifier: {
         forename: "Martha",
         surname: "Alexander",
         username: "malexander"
      },
      modified: "2015-07-25T13:58:38.000Z"
   }, {
      title: "Traveline National Dataset",
      nodeRef: "workspace:\/\/SpacesStore\/1ee1d994-b188-4746-8080-ba2359151087",
      creator: {
         forename: "Lisa",
         surname: "Burton",
         username: "lburton"
      },
      created: "2014-03-15T07:19:35.000Z",
      modifier: {
         forename: "Justin",
         surname: "Welch",
         username: "jwelch"
      },
      modified: "2015-02-02T18:00:12.000Z"
   }, {
      title: "Navy Junior Staff dataset",
      nodeRef: "workspace:\/\/SpacesStore\/7d29e4d4-a31a-444a-b47c-3d0a6fe9b4a0",
      creator: {
         forename: "Helen",
         surname: "Ramos",
         username: "hramos"
      },
      created: "2014-02-09T20:17:24.000Z",
      modifier: {
         forename: "Donna",
         surname: "James",
         username: "djames"
      },
      modified: "2015-03-21T04:09:32.000Z"
   }, {
      title: "Senior Manager Salaries",
      nodeRef: "workspace:\/\/SpacesStore\/ae6b2296-47b2-44b4-ad13-17a8c5069920",
      creator: {
         forename: "Stephen",
         surname: "Burke",
         username: "sburke"
      },
      created: "2014-05-12T19:39:14.000Z",
      modifier: {
         forename: "Nancy",
         surname: "Lawson",
         username: "nlawson"
      },
      modified: "2015-01-16T16:22:20.000Z"
   }, {
      title: "Waltham Forest",
      nodeRef: "workspace:\/\/SpacesStore\/ebfabfd6-3c8b-4d0f-91d1-3636e6271fee",
      creator: {
         forename: "Arthur",
         surname: "Fields",
         username: "afields"
      },
      created: "2013-11-02T22:41:32.000Z",
      modifier: {
         forename: "Patricia",
         surname: "Clark",
         username: "pclark"
      },
      modified: "2015-04-18T15:20:13.000Z"
   }, {
      title: "Links to the data",
      nodeRef: "workspace:\/\/SpacesStore\/0a8265ca-fb8b-49d6-8b81-954d5ac97ac7",
      creator: {
         forename: "Johnny",
         surname: "Rodriguez",
         username: "jrodriguez"
      },
      created: "2014-03-01T04:15:24.000Z",
      modifier: {
         forename: "Mark",
         surname: "Collins",
         username: "mcollins"
      },
      modified: "2015-07-18T22:07:33.000Z"
   }, {
      title: "Cycle Hub map data",
      nodeRef: "workspace:\/\/SpacesStore\/5c854c23-3c5b-4bd0-8d5a-edb6c19eba97",
      creator: {
         forename: "Kimberly",
         surname: "Howard",
         username: "khoward"
      },
      created: "2014-05-20T16:34:23.000Z",
      modifier: {
         forename: "Martin",
         surname: "Parker",
         username: "mparker"
      },
      modified: "2014-08-30T11:29:29.000Z"
   }, {
      title: "Schedule of meeting dates",
      nodeRef: "workspace:\/\/SpacesStore\/68522747-26ea-487f-bdcb-2871cf6b78e9",
      creator: {
         forename: "Tammy",
         surname: "Tucker",
         username: "ttucker"
      },
      created: "2013-11-19T18:53:09.000Z",
      modifier: {
         forename: "Virginia",
         surname: "Nguyen",
         username: "vnguyen"
      },
      modified: "2015-06-29T13:00:32.000Z"
   }, {
      title: "Non visa nationals",
      nodeRef: "workspace:\/\/SpacesStore\/035456cd-e744-4c2a-94d7-771de0a8818b",
      creator: {
         forename: "Louis",
         surname: "Simpson",
         username: "lsimpson"
      },
      created: "2014-06-11T21:14:21.000Z",
      modifier: {
         forename: "Joe",
         surname: "Scott",
         username: "jscott"
      },
      modified: "2015-02-09T19:27:22.000Z"
   }, {
      title: "Local Authority Housing Data",
      nodeRef: "workspace:\/\/SpacesStore\/79b60dc1-20d5-4f24-98c6-d06d3abb0a05",
      creator: {
         forename: "Rose",
         surname: "Edwards",
         username: "redwards"
      },
      created: "2014-08-02T11:32:22.000Z",
      modifier: {
         forename: "Thomas",
         surname: "Jenkins",
         username: "tjenkins"
      },
      modified: "2015-01-09T04:07:59.000Z"
   }, {
      title: "Appointments by sexual orientation",
      nodeRef: "workspace:\/\/SpacesStore\/9080efd6-57be-46bc-813a-577c7df4f353",
      creator: {
         forename: "Shirley",
         surname: "Peters",
         username: "speters"
      },
      created: "2013-10-01T07:20:41.000Z",
      modifier: {
         forename: "Marie",
         surname: "Henry",
         username: "mhenry"
      },
      modified: "2015-06-22T11:47:05.000Z"
   }, {
      title: "Information Systems output specification",
      nodeRef: "workspace:\/\/SpacesStore\/6efb70bc-3b1c-4d73-a77d-9c85f8cd971f",
      creator: {
         forename: "Jacqueline",
         surname: "Black",
         username: "jblack"
      },
      created: "2013-10-08T00:50:20.000Z",
      modifier: {
         forename: "Gerald",
         surname: "Fowler",
         username: "gfowler"
      },
      modified: "2015-07-16T20:01:19.000Z"
   }, {
      title: "Rain gauge rainfall data",
      nodeRef: "workspace:\/\/SpacesStore\/c685d4e5-baa0-4e21-9dff-9f17395290e3",
      creator: {
         forename: "Carlos",
         surname: "Nichols",
         username: "cnichols"
      },
      created: "2013-11-30T19:13:40.000Z",
      modifier: {
         forename: "Diana",
         surname: "Mcdonald",
         username: "dmcdonald"
      },
      modified: "2015-07-10T13:30:05.000Z"
   }, {
      title: "Chief of Joint Operations",
      nodeRef: "workspace:\/\/SpacesStore\/0a857cfb-393d-4d77-afd8-508aa9493681",
      creator: {
         forename: "Carl",
         surname: "Howard",
         username: "choward"
      },
      created: "2014-08-18T00:29:56.000Z",
      modifier: {
         forename: "Ralph",
         surname: "Jordan",
         username: "rjordan"
      },
      modified: "2015-02-09T17:44:04.000Z"
   }, {
      title: "Epping Forest",
      nodeRef: "workspace:\/\/SpacesStore\/a23a334f-2b02-4075-ba05-5cb36d6471f7",
      creator: {
         forename: "Anna",
         surname: "Weaver",
         username: "aweaver"
      },
      created: "2014-05-20T03:35:12.000Z",
      modifier: {
         forename: "Charles",
         surname: "Cox",
         username: "ccox"
      },
      modified: "2015-07-05T18:54:26.000Z"
   }, {
      title: "Adapting Your Home",
      nodeRef: "workspace:\/\/SpacesStore\/be06608b-8397-4758-94b7-79970ef273df",
      creator: {
         forename: "Samuel",
         surname: "Sanders",
         username: "ssanders"
      },
      created: "2014-07-16T08:18:12.000Z",
      modifier: {
         forename: "Bonnie",
         surname: "Arnold",
         username: "barnold"
      },
      modified: "2015-02-12T12:17:35.000Z"
   }, {
      title: "Expenditure information",
      nodeRef: "workspace:\/\/SpacesStore\/ae97087a-6c7c-4b9a-916c-e5bb2835208a",
      creator: {
         forename: "Alice",
         surname: "Richards",
         username: "arichards"
      },
      created: "2014-07-02T03:50:44.000Z",
      modifier: {
         forename: "Joseph",
         surname: "Carter",
         username: "jcarter"
      },
      modified: "2015-08-08T02:21:16.000Z"
   }, {
      title: "NHS Immunisation Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/12a4ba6d-1571-4c73-a8cb-28099c1b4d10",
      creator: {
         forename: "Jane",
         surname: "Hart",
         username: "jhart"
      },
      created: "2014-05-15T07:32:05.000Z",
      modifier: {
         forename: "Nicholas",
         surname: "Webb",
         username: "nwebb"
      },
      modified: "2015-07-15T04:31:08.000Z"
   }, {
      title: "Social worker",
      nodeRef: "workspace:\/\/SpacesStore\/c99ede97-cdcf-4090-af17-aa75f3ff933d",
      creator: {
         forename: "Michael",
         surname: "Reynolds",
         username: "mreynolds"
      },
      created: "2013-11-25T11:32:51.000Z",
      modifier: {
         forename: "Ann",
         surname: "Gilbert",
         username: "agilbert"
      },
      modified: "2014-10-05T23:43:43.000Z"
   }, {
      title: "CMR WAL radio data",
      nodeRef: "workspace:\/\/SpacesStore\/41fb7b05-5d1b-4e84-818e-39b4edce1cc5",
      creator: {
         forename: "Victor",
         surname: "Collins",
         username: "vcollins"
      },
      created: "2014-07-24T15:18:38.000Z",
      modifier: {
         forename: "Douglas",
         surname: "Howard",
         username: "dhoward"
      },
      modified: "2014-12-01T00:44:52.000Z"
   }, {
      title: "Junior roles",
      nodeRef: "workspace:\/\/SpacesStore\/2c897ea3-c8df-4a21-a5a9-cce36c157312",
      creator: {
         forename: "Kimberly",
         surname: "Franklin",
         username: "kfranklin"
      },
      created: "2013-12-14T14:04:05.000Z",
      modifier: {
         forename: "Maria",
         surname: "Kim",
         username: "mkim"
      },
      modified: "2015-05-23T08:09:47.000Z"
   }, {
      title: "Disciplinary cases by gender",
      nodeRef: "workspace:\/\/SpacesStore\/245f5c74-bd5d-48a9-96be-356fb1ac1583",
      creator: {
         forename: "Kevin",
         surname: "Roberts",
         username: "kroberts"
      },
      created: "2014-06-11T00:30:30.000Z",
      modifier: {
         forename: "Amy",
         surname: "Thomas",
         username: "athomas"
      },
      modified: "2014-09-29T05:56:57.000Z"
   }, {
      title: "Meeting with external organisations",
      nodeRef: "workspace:\/\/SpacesStore\/5a1f713a-4b22-4702-b52a-72df2561b29c",
      creator: {
         forename: "Diane",
         surname: "Gonzales",
         username: "dgonzales"
      },
      created: "2013-08-26T04:44:52.000Z",
      modifier: {
         forename: "Catherine",
         surname: "Franklin",
         username: "cfranklin"
      },
      modified: "2014-08-27T19:05:25.000Z"
   }, {
      title: "November return",
      nodeRef: "workspace:\/\/SpacesStore\/6f20aaba-304d-4e5b-a553-e143123d9799",
      creator: {
         forename: "Charles",
         surname: "Hudson",
         username: "chudson"
      },
      created: "2013-12-21T11:11:16.000Z",
      modifier: {
         forename: "Antonio",
         surname: "Chavez",
         username: "achavez"
      },
      modified: "2015-03-05T03:49:00.000Z"
   }, {
      title: "Live Tables on Housebuilding",
      nodeRef: "workspace:\/\/SpacesStore\/56c548ba-d162-4938-995c-0c4e722d3225",
      creator: {
         forename: "Kevin",
         surname: "Hudson",
         username: "khudson"
      },
      created: "2013-09-26T06:39:32.000Z",
      modifier: {
         forename: "Lori",
         surname: "Simpson",
         username: "lsimpson"
      },
      modified: "2014-12-12T04:23:13.000Z"
   }, {
      title: "External appointments by ethnicity",
      nodeRef: "workspace:\/\/SpacesStore\/041140b6-1a52-4a59-8f86-2efe96b0942a",
      creator: {
         forename: "Cynthia",
         surname: "Sims",
         username: "csims"
      },
      created: "2013-12-07T09:57:27.000Z",
      modifier: {
         forename: "Roger",
         surname: "Ray",
         username: "rray"
      },
      modified: "2015-05-13T09:45:38.000Z"
   }, {
      title: "User guide",
      nodeRef: "workspace:\/\/SpacesStore\/18909452-f047-41e2-80f0-6905c56655d8",
      creator: {
         forename: "Kelly",
         surname: "Hunter",
         username: "khunter"
      },
      created: "2014-03-01T01:12:59.000Z",
      modifier: {
         forename: "Judith",
         surname: "Willis",
         username: "jwillis"
      },
      modified: "2015-05-31T13:49:41.000Z"
   }, {
      title: "Dynamic Maps",
      nodeRef: "workspace:\/\/SpacesStore\/45924d13-3d2a-45b6-84a8-c01a9f00498d",
      creator: {
         forename: "Gerald",
         surname: "Sullivan",
         username: "gsullivan"
      },
      created: "2014-07-27T19:27:19.000Z",
      modifier: {
         forename: "Shirley",
         surname: "Harris",
         username: "sharris"
      },
      modified: "2015-07-30T14:10:03.000Z"
   }, {
      title: "List of projects",
      nodeRef: "workspace:\/\/SpacesStore\/7f82f917-8c09-4b69-8b38-611487b80e40",
      creator: {
         forename: "Louis",
         surname: "Wilson",
         username: "lwilson"
      },
      created: "2014-04-04T03:54:58.000Z",
      modifier: {
         forename: "Justin",
         surname: "Henry",
         username: "jhenry"
      },
      modified: "2015-05-23T21:01:42.000Z"
   }, {
      title: "Companies House Find Information",
      nodeRef: "workspace:\/\/SpacesStore\/48a214bc-1a45-498e-8696-41abbf5aa4e9",
      creator: {
         forename: "Douglas",
         surname: "Bailey",
         username: "dbailey"
      },
      created: "2014-06-12T11:51:05.000Z",
      modifier: {
         forename: "Randy",
         surname: "Chavez",
         username: "rchavez"
      },
      modified: "2015-05-01T23:39:50.000Z"
   }, {
      title: "Green Belt",
      nodeRef: "workspace:\/\/SpacesStore\/e246e3df-0e39-4e6c-8345-dce83c99d685",
      creator: {
         forename: "Joan",
         surname: "Lane",
         username: "jlane"
      },
      created: "2014-08-08T02:49:31.000Z",
      modifier: {
         forename: "Bonnie",
         surname: "Simpson",
         username: "bsimpson"
      },
      modified: "2014-10-20T05:07:33.000Z"
   }, {
      title: "National Archives Online Satisfaction",
      nodeRef: "workspace:\/\/SpacesStore\/8217ca64-5995-4ca6-8dc2-b5eebc7d8a39",
      creator: {
         forename: "Carlos",
         surname: "Morrison",
         username: "cmorrison"
      },
      created: "2013-11-27T09:40:43.000Z",
      modifier: {
         forename: "Edward",
         surname: "Nichols",
         username: "enichols"
      },
      modified: "2014-10-21T21:59:47.000Z"
   }, {
      title: "SLDC Car Park webpage",
      nodeRef: "workspace:\/\/SpacesStore\/d8a77d54-6026-444a-b15c-831117adcdce",
      creator: {
         forename: "Richard",
         surname: "White",
         username: "rwhite"
      },
      created: "2014-07-03T14:21:11.000Z",
      modifier: {
         forename: "Alan",
         surname: "Howell",
         username: "ahowell"
      },
      modified: "2014-11-27T02:02:53.000Z"
   }, {
      title: "Internal appointments by age",
      nodeRef: "workspace:\/\/SpacesStore\/fc4bc7ee-799d-40d8-b8c2-75ada28f7ccb",
      creator: {
         forename: "Stephen",
         surname: "Mason",
         username: "smason"
      },
      created: "2013-12-27T15:49:55.000Z",
      modifier: {
         forename: "Lawrence",
         surname: "Hughes",
         username: "lhughes"
      },
      modified: "2015-01-17T23:04:16.000Z"
   }, {
      title: "Further information",
      nodeRef: "workspace:\/\/SpacesStore\/1bea5adf-37a8-4c5c-83b6-fb6f5f772f6b",
      creator: {
         forename: "Julie",
         surname: "Rogers",
         username: "jrogers"
      },
      created: "2013-11-04T13:30:34.000Z",
      modifier: {
         forename: "Harry",
         surname: "Ellis",
         username: "hellis"
      },
      modified: "2015-04-12T19:22:03.000Z"
   }, {
      title: "Overall Success Rates",
      nodeRef: "workspace:\/\/SpacesStore\/2299c296-7b95-4332-8deb-b80e53532f48",
      creator: {
         forename: "Steve",
         surname: "Stephens",
         username: "sstephens"
      },
      created: "2013-12-18T05:53:03.000Z",
      modifier: {
         forename: "Ronald",
         surname: "Ryan",
         username: "rryan"
      },
      modified: "2015-07-31T11:08:38.000Z"
   }, {
      title: "ICT Spend",
      nodeRef: "workspace:\/\/SpacesStore\/c43a8f09-a170-4b3d-92b9-5f3c87309835",
      creator: {
         forename: "Patricia",
         surname: "Carpenter",
         username: "pcarpenter"
      },
      created: "2013-09-28T19:37:00.000Z",
      modifier: {
         forename: "Mark",
         surname: "Wood",
         username: "mwood"
      },
      modified: "2014-10-06T10:49:17.000Z"
   }, {
      title: "Internal applicants by sexual orientation",
      nodeRef: "workspace:\/\/SpacesStore\/ae5aae87-89d1-4be5-9410-08bdcd4e9b0c",
      creator: {
         forename: "Katherine",
         surname: "Watson",
         username: "kwatson"
      },
      created: "2013-11-07T11:19:57.000Z",
      modifier: {
         forename: "Jane",
         surname: "Mcdonald",
         username: "jmcdonald"
      },
      modified: "2015-05-27T16:45:44.000Z"
   }, {
      title: "GM Accident Data",
      nodeRef: "workspace:\/\/SpacesStore\/3d181135-cfaa-4621-8f53-7e3c8908ad8a",
      creator: {
         forename: "Wanda",
         surname: "Payne",
         username: "wpayne"
      },
      created: "2013-09-22T22:55:37.000Z",
      modifier: {
         forename: "Judith",
         surname: "Wilson",
         username: "jwilson"
      },
      modified: "2015-01-20T15:40:49.000Z"
   }, {
      title: "Crime data portal",
      nodeRef: "workspace:\/\/SpacesStore\/cf805923-2a51-4c55-9c49-65ded6b04a8e",
      creator: {
         forename: "Diana",
         surname: "Stephens",
         username: "dstephens"
      },
      created: "2013-12-28T06:38:00.000Z",
      modifier: {
         forename: "Maria",
         surname: "Brooks",
         username: "mbrooks"
      },
      modified: "2015-06-26T04:04:26.000Z"
   }, {
      title: "Doing Business With Us",
      nodeRef: "workspace:\/\/SpacesStore\/e1653aa2-3c54-4dc8-8e52-f87be60ce0ff",
      creator: {
         forename: "Debra",
         surname: "Peters",
         username: "dpeters"
      },
      created: "2014-08-15T17:54:42.000Z",
      modifier: {
         forename: "Gregory",
         surname: "Henry",
         username: "ghenry"
      },
      modified: "2015-02-07T01:15:06.000Z"
   }, {
      title: "Organisation Footnotes",
      nodeRef: "workspace:\/\/SpacesStore\/e6c025cb-0e45-4c1a-b7f6-1da5d7c3bf29",
      creator: {
         forename: "Christina",
         surname: "Washington",
         username: "cwashington"
      },
      created: "2014-07-18T18:05:39.000Z",
      modifier: {
         forename: "Willie",
         surname: "Kelly",
         username: "wkelly"
      },
      modified: "2014-08-21T19:52:25.000Z"
   }, {
      title: "User satisfaction data",
      nodeRef: "workspace:\/\/SpacesStore\/41f7c8f0-8f6f-4546-b40e-c4a6ca27123a",
      creator: {
         forename: "Kathy",
         surname: "Moreno",
         username: "kmoreno"
      },
      created: "2014-04-16T06:34:11.000Z",
      modifier: {
         forename: "Jack",
         surname: "Hernandez",
         username: "jhernandez"
      },
      modified: "2015-08-15T08:14:52.000Z"
   }, {
      title: "West Lindsey",
      nodeRef: "workspace:\/\/SpacesStore\/9186e15e-77a9-40e3-876b-bcaedb72fb0d",
      creator: {
         forename: "Robin",
         surname: "Reyes",
         username: "rreyes"
      },
      created: "2013-11-07T02:58:01.000Z",
      modifier: {
         forename: "Lois",
         surname: "Adams",
         username: "ladams"
      },
      modified: "2015-06-13T23:07:33.000Z"
   }, {
      title: "Procurement webpage",
      nodeRef: "workspace:\/\/SpacesStore\/353f70af-2635-42de-ae1f-fe1fb410ab09",
      creator: {
         forename: "Joseph",
         surname: "Oliver",
         username: "joliver"
      },
      created: "2013-11-14T08:49:23.000Z",
      modifier: {
         forename: "Craig",
         surname: "Dixon",
         username: "cdixon"
      },
      modified: "2014-08-22T06:15:19.000Z"
   }, {
      title: "Vehicle theft",
      nodeRef: "workspace:\/\/SpacesStore\/4e26b35a-12ff-41b3-8a33-094e80a7df7e",
      creator: {
         forename: "Brian",
         surname: "Reynolds",
         username: "breynolds"
      },
      created: "2014-08-06T20:11:16.000Z",
      modifier: {
         forename: "Diana",
         surname: "Bell",
         username: "dbell"
      },
      modified: "2015-08-10T23:53:10.000Z"
   }, {
      title: "Guide to Home Office statistics",
      nodeRef: "workspace:\/\/SpacesStore\/8907bb1b-0f00-47e4-b854-208696086424",
      creator: {
         forename: "Marilyn",
         surname: "Shaw",
         username: "mshaw"
      },
      created: "2014-03-25T04:45:10.000Z",
      modifier: {
         forename: "Jerry",
         surname: "Fields",
         username: "jfields"
      },
      modified: "2014-12-18T04:51:37.000Z"
   }, {
      title: "Single data list",
      nodeRef: "workspace:\/\/SpacesStore\/0ba4e914-fb39-4e55-99f6-f2316c1cdca0",
      creator: {
         forename: "Lori",
         surname: "Simmons",
         username: "lsimmons"
      },
      created: "2014-07-04T15:55:35.000Z",
      modifier: {
         forename: "Eugene",
         surname: "Greene",
         username: "egreene"
      },
      modified: "2014-10-19T08:59:31.000Z"
   }, {
      title: "Defence Equipment Support Junior staff dataset",
      nodeRef: "workspace:\/\/SpacesStore\/70730650-bf91-480f-b733-00818a735bfe",
      creator: {
         forename: "Tina",
         surname: "Cruz",
         username: "tcruz"
      },
      created: "2013-09-04T02:57:44.000Z",
      modifier: {
         forename: "Debra",
         surname: "Brown",
         username: "dbrown"
      },
      modified: "2015-06-12T11:41:49.000Z"
   }, {
      title: "Notes for datasets",
      nodeRef: "workspace:\/\/SpacesStore\/127cd11a-c08e-4f04-a458-6a9d900d27cd",
      creator: {
         forename: "George",
         surname: "Moreno",
         username: "gmoreno"
      },
      created: "2014-03-25T19:10:12.000Z",
      modifier: {
         forename: "Kenneth",
         surname: "Hall",
         username: "khall"
      },
      modified: "2014-12-07T10:10:58.000Z"
   }, {
      title: "NPDA data field description",
      nodeRef: "workspace:\/\/SpacesStore\/128a8977-b20c-4123-bfae-66df158f4bc7",
      creator: {
         forename: "Harry",
         surname: "Jackson",
         username: "hjackson"
      },
      created: "2014-01-18T08:56:52.000Z",
      modifier: {
         forename: "Jacqueline",
         surname: "Mills",
         username: "jmills"
      },
      modified: "2015-04-12T04:25:12.000Z"
   }, {
      title: "Further Information",
      nodeRef: "workspace:\/\/SpacesStore\/cf1d80eb-fc6b-4c7b-9dbf-fceea3dee8f5",
      creator: {
         forename: "Lois",
         surname: "Daniels",
         username: "ldaniels"
      },
      created: "2014-06-05T19:29:31.000Z",
      modifier: {
         forename: "Cheryl",
         surname: "Henry",
         username: "chenry"
      },
      modified: "2014-09-14T11:14:54.000Z"
   }, {
      title: "Pest control",
      nodeRef: "workspace:\/\/SpacesStore\/3a137c50-5788-4292-bc19-0cad9a3f7bc4",
      creator: {
         forename: "Johnny",
         surname: "Snyder",
         username: "jsnyder"
      },
      created: "2013-12-20T10:46:37.000Z",
      modifier: {
         forename: "Robin",
         surname: "Duncan",
         username: "rduncan"
      },
      modified: "2015-06-01T00:09:45.000Z"
   }, {
      title: "Metadata Records",
      nodeRef: "workspace:\/\/SpacesStore\/b3d86b2c-6561-4e12-bbd6-6b3eee10ba72",
      creator: {
         forename: "Kelly",
         surname: "Stewart",
         username: "kstewart"
      },
      created: "2014-05-28T11:36:10.000Z",
      modifier: {
         forename: "Marilyn",
         surname: "Lawrence",
         username: "mlawrence"
      },
      modified: "2015-07-29T18:29:37.000Z"
   }, {
      title: "North Somerset",
      nodeRef: "workspace:\/\/SpacesStore\/4c94e3e0-c5b4-4fce-8602-12ab0f7bf2f5",
      creator: {
         forename: "Joyce",
         surname: "Torres",
         username: "jtorres"
      },
      created: "2013-10-28T18:45:16.000Z",
      modifier: {
         forename: "Lisa",
         surname: "Carr",
         username: "lcarr"
      },
      modified: "2015-08-03T22:15:01.000Z"
   }, {
      title: "SPARQL end point",
      nodeRef: "workspace:\/\/SpacesStore\/0ca16123-c486-495a-ae44-d19821972ca3",
      creator: {
         forename: "Steve",
         surname: "Palmer",
         username: "spalmer"
      },
      created: "2013-11-19T21:51:23.000Z",
      modifier: {
         forename: "Gerald",
         surname: "Hawkins",
         username: "ghawkins"
      },
      modified: "2014-12-05T18:16:08.000Z"
   }, {
      title: "Glossary Document",
      nodeRef: "workspace:\/\/SpacesStore\/2cd9201c-ffd5-46d4-adda-a05a278d7504",
      creator: {
         forename: "Christine",
         surname: "Cunningham",
         username: "ccunningham"
      },
      created: "2014-04-17T01:05:40.000Z",
      modifier: {
         forename: "Ann",
         surname: "Williamson",
         username: "awilliamson"
      },
      modified: "2014-09-24T07:14:45.000Z"
   }, {
      title: "Information for patients webpage",
      nodeRef: "workspace:\/\/SpacesStore\/21102026-55c6-487c-bb17-665505455978",
      creator: {
         forename: "Carl",
         surname: "Greene",
         username: "cgreene"
      },
      created: "2014-04-25T03:37:47.000Z",
      modifier: {
         forename: "Walter",
         surname: "Clark",
         username: "wclark"
      },
      modified: "2015-06-01T13:05:24.000Z"
   }, {
      title: "FOI and EIR Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/25a87029-ee7c-4ab8-82ca-cc123ff87ccd",
      creator: {
         forename: "Anne",
         surname: "Perkins",
         username: "aperkins"
      },
      created: "2014-04-01T06:45:46.000Z",
      modifier: {
         forename: "Debra",
         surname: "Wright",
         username: "dwright"
      },
      modified: "2015-06-14T12:59:39.000Z"
   }, {
      title: "Parking income and expenditure",
      nodeRef: "workspace:\/\/SpacesStore\/63da24d9-7d92-4e76-890f-29e1365bb933",
      creator: {
         forename: "Ralph",
         surname: "Kelley",
         username: "rkelley"
      },
      created: "2013-09-15T23:38:58.000Z",
      modifier: {
         forename: "Melissa",
         surname: "Hunt",
         username: "mhunt"
      },
      modified: "2015-03-04T09:35:27.000Z"
   }, {
      title: "Met Office Download service",
      nodeRef: "workspace:\/\/SpacesStore\/1f48902c-059b-4df1-8323-e8bdfc9ad243",
      creator: {
         forename: "William",
         surname: "Hunter",
         username: "whunter"
      },
      created: "2013-12-14T10:30:46.000Z",
      modifier: {
         forename: "Diana",
         surname: "Smith",
         username: "dsmith"
      },
      modified: "2014-11-11T19:55:33.000Z"
   }, {
      title: "Open Data Public Toilets",
      nodeRef: "workspace:\/\/SpacesStore\/a7fc398d-cca3-4fa9-895d-7934dd909e8d",
      creator: {
         forename: "Steve",
         surname: "Martinez",
         username: "smartinez"
      },
      created: "2013-10-24T02:53:10.000Z",
      modifier: {
         forename: "Evelyn",
         surname: "Graham",
         username: "egraham"
      },
      modified: "2014-09-10T10:05:44.000Z"
   }, {
      title: "Senior staff salary",
      nodeRef: "workspace:\/\/SpacesStore\/48b2e48d-33c9-401f-a3fd-54fc945c8340",
      creator: {
         forename: "Sara",
         surname: "Jenkins",
         username: "sjenkins"
      },
      created: "2014-04-11T05:59:57.000Z",
      modifier: {
         forename: "Kathryn",
         surname: "Hawkins",
         username: "khawkins"
      },
      modified: "2015-01-08T06:29:34.000Z"
   }, {
      title: "General Fund",
      nodeRef: "workspace:\/\/SpacesStore\/6db16f82-0b88-4177-ada8-cdec7c0fe1b0",
      creator: {
         forename: "Harry",
         surname: "Harvey",
         username: "hharvey"
      },
      created: "2013-11-29T14:43:01.000Z",
      modifier: {
         forename: "Craig",
         surname: "Alvarez",
         username: "calvarez"
      },
      modified: "2014-12-28T19:46:59.000Z"
   }, {
      title: "Outcomes open data notes",
      nodeRef: "workspace:\/\/SpacesStore\/bd8513ee-1684-4557-aa46-b7ae8279e6a5",
      creator: {
         forename: "John",
         surname: "Hanson",
         username: "jhanson"
      },
      created: "2014-04-06T17:15:48.000Z",
      modifier: {
         forename: "Ann",
         surname: "Kennedy",
         username: "akennedy"
      },
      modified: "2014-11-19T22:45:50.000Z"
   }, {
      title: "Questions by Year Group",
      nodeRef: "workspace:\/\/SpacesStore\/0c247b69-b429-49ba-968c-91899610b308",
      creator: {
         forename: "Sara",
         surname: "Murphy",
         username: "smurphy"
      },
      created: "2014-01-24T23:09:03.000Z",
      modifier: {
         forename: "Howard",
         surname: "Burton",
         username: "hburton"
      },
      modified: "2015-07-02T08:18:43.000Z"
   }, {
      title: "External appointments by disability",
      nodeRef: "workspace:\/\/SpacesStore\/b74fca7d-7488-491b-ae55-090b96a2ec88",
      creator: {
         forename: "Andrew",
         surname: "Burke",
         username: "aburke"
      },
      created: "2013-09-25T09:11:56.000Z",
      modifier: {
         forename: "Carolyn",
         surname: "Brooks",
         username: "cbrooks"
      },
      modified: "2014-12-14T23:22:53.000Z"
   }, {
      title: "Bury Main Report",
      nodeRef: "workspace:\/\/SpacesStore\/f3d91be4-db74-4c3e-8e07-467be8bfb8f1",
      creator: {
         forename: "Cynthia",
         surname: "Andrews",
         username: "candrews"
      },
      created: "2014-05-26T02:37:17.000Z",
      modifier: {
         forename: "Justin",
         surname: "Hart",
         username: "jhart"
      },
      modified: "2015-05-15T09:06:17.000Z"
   }, {
      title: "Property crime",
      nodeRef: "workspace:\/\/SpacesStore\/64b72093-e8de-4bb6-9ad0-52791cdb28b8",
      creator: {
         forename: "Martha",
         surname: "Cole",
         username: "mcole"
      },
      created: "2014-06-29T19:01:18.000Z",
      modifier: {
         forename: "Kathryn",
         surname: "Sims",
         username: "ksims"
      },
      modified: "2015-06-01T14:38:11.000Z"
   }, {
      title: "ASAP data file",
      nodeRef: "workspace:\/\/SpacesStore\/6e62ab39-5ad7-4e80-abec-e7e9511aba28",
      creator: {
         forename: "Sandra",
         surname: "Adams",
         username: "sadams"
      },
      created: "2013-12-24T01:10:05.000Z",
      modifier: {
         forename: "Ruby",
         surname: "Jackson",
         username: "rjackson"
      },
      modified: "2014-12-11T16:25:43.000Z"
   }, {
      title: "North West Leicestershire",
      nodeRef: "workspace:\/\/SpacesStore\/c44cc4e9-4c14-4cf5-a8b4-b98010fe0fae",
      creator: {
         forename: "Steven",
         surname: "Jordan",
         username: "sjordan"
      },
      created: "2014-02-06T15:27:01.000Z",
      modifier: {
         forename: "Paula",
         surname: "Kelley",
         username: "pkelley"
      },
      modified: "2015-03-17T10:59:09.000Z"
   }, {
      title: "Live Tables on Homlessness",
      nodeRef: "workspace:\/\/SpacesStore\/fea5d35b-ef88-4705-8467-8f114af94dcd",
      creator: {
         forename: "Carl",
         surname: "Bowman",
         username: "cbowman"
      },
      created: "2014-01-24T05:13:31.000Z",
      modifier: {
         forename: "Russell",
         surname: "Hunt",
         username: "rhunt"
      },
      modified: "2015-05-12T18:58:09.000Z"
   }, {
      title: "Hospitality",
      nodeRef: "workspace:\/\/SpacesStore\/54f87267-4f27-4f1b-b3ff-4f52134bac2d",
      creator: {
         forename: "Helen",
         surname: "White",
         username: "hwhite"
      },
      created: "2013-10-27T19:01:43.000Z",
      modifier: {
         forename: "Gregory",
         surname: "Howard",
         username: "ghoward"
      },
      modified: "2015-01-13T09:28:13.000Z"
   }, {
      title: "Notable Species",
      nodeRef: "workspace:\/\/SpacesStore\/1adfc438-5ed7-4707-90ca-f3d3156855e9",
      creator: {
         forename: "Lisa",
         surname: "Jones",
         username: "ljones"
      },
      created: "2013-12-04T22:03:05.000Z",
      modifier: {
         forename: "Virginia",
         surname: "Burton",
         username: "vburton"
      },
      modified: "2015-01-30T20:27:54.000Z"
   }, {
      title: "Car Parks data schema",
      nodeRef: "workspace:\/\/SpacesStore\/3c35f373-86a5-479c-8578-d86ad5236462",
      creator: {
         forename: "Jeremy",
         surname: "Brown",
         username: "jbrown"
      },
      created: "2014-06-01T19:40:48.000Z",
      modifier: {
         forename: "Jonathan",
         surname: "Gordon",
         username: "jgordon"
      },
      modified: "2015-03-30T14:55:35.000Z"
   }, {
      title: "Senior Officals hospitality",
      nodeRef: "workspace:\/\/SpacesStore\/aad19d44-fb17-46ae-8358-848b07f56eb5",
      creator: {
         forename: "Cynthia",
         surname: "Marshall",
         username: "cmarshall"
      },
      created: "2013-09-29T05:41:27.000Z",
      modifier: {
         forename: "Jeffrey",
         surname: "Coleman",
         username: "jcoleman"
      },
      modified: "2014-09-13T12:01:36.000Z"
   }, {
      title: "Asset recovery data",
      nodeRef: "workspace:\/\/SpacesStore\/3fede33f-db84-42bb-8d3e-540744dc24e9",
      creator: {
         forename: "Kathleen",
         surname: "Day",
         username: "kday"
      },
      created: "2014-05-20T23:19:07.000Z",
      modifier: {
         forename: "Joseph",
         surname: "Hill",
         username: "jhill"
      },
      modified: "2014-10-13T09:22:58.000Z"
   }, {
      title: "Trust Website",
      nodeRef: "workspace:\/\/SpacesStore\/ee835f80-6a3f-42e1-845c-5a4e18f67c4d",
      creator: {
         forename: "Paula",
         surname: "Riley",
         username: "priley"
      },
      created: "2014-06-25T19:31:27.000Z",
      modifier: {
         forename: "Johnny",
         surname: "Murphy",
         username: "jmurphy"
      },
      modified: "2014-10-31T19:56:13.000Z"
   }, {
      title: "Bus Stopping Points",
      nodeRef: "workspace:\/\/SpacesStore\/b1092366-fe14-42e7-9ee5-35fcc0611571",
      creator: {
         forename: "Henry",
         surname: "Hanson",
         username: "hhanson"
      },
      created: "2014-02-08T19:45:07.000Z",
      modifier: {
         forename: "Jeremy",
         surname: "Barnes",
         username: "jbarnes"
      },
      modified: "2015-08-18T08:40:59.000Z"
   }, {
      title: "Empty Residential Properties",
      nodeRef: "workspace:\/\/SpacesStore\/b921fedc-15e2-491d-8ed1-868dcc3565e5",
      creator: {
         forename: "Anthony",
         surname: "Simmons",
         username: "asimmons"
      },
      created: "2014-01-15T22:17:14.000Z",
      modifier: {
         forename: "Keith",
         surname: "Moreno",
         username: "kmoreno"
      },
      modified: "2014-08-29T08:47:16.000Z"
   }, {
      title: "Look up tables",
      nodeRef: "workspace:\/\/SpacesStore\/df47aa8b-8479-4eca-9833-187a46335b90",
      creator: {
         forename: "Edward",
         surname: "Henry",
         username: "ehenry"
      },
      created: "2014-06-02T02:31:45.000Z",
      modifier: {
         forename: "Debra",
         surname: "Ford",
         username: "dford"
      },
      modified: "2015-07-11T05:37:48.000Z"
   }, {
      title: "Brighton and Hove",
      nodeRef: "workspace:\/\/SpacesStore\/468fb907-eac7-4de7-a4c2-d0957a7f1d93",
      creator: {
         forename: "Brian",
         surname: "Nelson",
         username: "bnelson"
      },
      created: "2013-08-21T14:46:05.000Z",
      modifier: {
         forename: "Jessica",
         surname: "Gibson",
         username: "jgibson"
      },
      modified: "2015-04-07T01:24:45.000Z"
   }, {
      title: "Impact on NHS resources",
      nodeRef: "workspace:\/\/SpacesStore\/9ba67eb1-b577-402e-8b71-c809dc18ed68",
      creator: {
         forename: "Fred",
         surname: "Porter",
         username: "fporter"
      },
      created: "2013-09-23T20:00:31.000Z",
      modifier: {
         forename: "Clarence",
         surname: "Burton",
         username: "cburton"
      },
      modified: "2015-06-27T13:06:06.000Z"
   }, {
      title: "Major Qualification Success Rates",
      nodeRef: "workspace:\/\/SpacesStore\/ee9d4284-3ad5-4769-9d56-a26af2cb53d1",
      creator: {
         forename: "Wanda",
         surname: "Jackson",
         username: "wjackson"
      },
      created: "2014-04-12T13:29:56.000Z",
      modifier: {
         forename: "Ryan",
         surname: "Dunn",
         username: "rdunn"
      },
      modified: "2015-06-16T01:16:59.000Z"
   }, {
      title: "Map viewer",
      nodeRef: "workspace:\/\/SpacesStore\/c7b67511-9a1e-4228-8568-5c5681871253",
      creator: {
         forename: "Elizabeth",
         surname: "Richards",
         username: "erichards"
      },
      created: "2013-12-16T02:42:38.000Z",
      modifier: {
         forename: "Julia",
         surname: "Porter",
         username: "jporter"
      },
      modified: "2014-10-05T06:45:33.000Z"
   }, {
      title: "CMR NI telecoms data",
      nodeRef: "workspace:\/\/SpacesStore\/cdfe3ae5-7eff-451d-aaa8-a983d686569e",
      creator: {
         forename: "Todd",
         surname: "Castillo",
         username: "tcastillo"
      },
      created: "2014-04-22T06:18:22.000Z",
      modifier: {
         forename: "Jose",
         surname: "Marshall",
         username: "jmarshall"
      },
      modified: "2014-09-10T04:50:58.000Z"
   }, {
      title: "Harlow",
      nodeRef: "workspace:\/\/SpacesStore\/4c13ba6f-a398-4a37-85e0-77d8694caa4d",
      creator: {
         forename: "Deborah",
         surname: "Watkins",
         username: "dwatkins"
      },
      created: "2014-02-14T19:34:17.000Z",
      modifier: {
         forename: "Rose",
         surname: "Perez",
         username: "rperez"
      },
      modified: "2014-08-27T17:25:56.000Z"
   }, {
      title: "The Single Data List",
      nodeRef: "workspace:\/\/SpacesStore\/b4a271a2-1d78-4fe8-8203-4a69599b40cb",
      creator: {
         forename: "Joan",
         surname: "Bennett",
         username: "jbennett"
      },
      created: "2013-10-09T11:09:33.000Z",
      modifier: {
         forename: "Eugene",
         surname: "Daniels",
         username: "edaniels"
      },
      modified: "2014-09-26T14:34:48.000Z"
   }, {
      title: "Malvern Hills",
      nodeRef: "workspace:\/\/SpacesStore\/8032d150-f7b3-443e-8913-3432604c3e7e",
      creator: {
         forename: "Irene",
         surname: "Henry",
         username: "ihenry"
      },
      created: "2014-01-25T17:49:56.000Z",
      modifier: {
         forename: "Richard",
         surname: "Foster",
         username: "rfoster"
      },
      modified: "2015-06-11T16:30:13.000Z"
   }, {
      title: "Public Health Funerals",
      nodeRef: "workspace:\/\/SpacesStore\/d18b5a6e-d7f0-4fa1-85c1-5457a37186ff",
      creator: {
         forename: "Emily",
         surname: "Gonzalez",
         username: "egonzalez"
      },
      created: "2014-04-26T02:53:38.000Z",
      modifier: {
         forename: "Emily",
         surname: "Myers",
         username: "emyers"
      },
      modified: "2014-09-13T04:56:22.000Z"
   }, {
      title: "Internal appointments by ethnicity",
      nodeRef: "workspace:\/\/SpacesStore\/7d7775ac-0ee7-4434-a6a6-ca6ed89aa30e",
      creator: {
         forename: "Betty",
         surname: "Baker",
         username: "bbaker"
      },
      created: "2014-05-26T18:04:26.000Z",
      modifier: {
         forename: "Brandon",
         surname: "Hawkins",
         username: "bhawkins"
      },
      modified: "2014-12-16T10:05:15.000Z"
   }, {
      title: "June return",
      nodeRef: "workspace:\/\/SpacesStore\/77cc1785-7854-4772-868a-424149dec9cd",
      creator: {
         forename: "Shirley",
         surname: "Adams",
         username: "sadams"
      },
      created: "2014-03-24T20:32:40.000Z",
      modifier: {
         forename: "Philip",
         surname: "Ford",
         username: "pford"
      },
      modified: "2014-10-30T19:58:28.000Z"
   }, {
      title: "Hospitality received by special advisers",
      nodeRef: "workspace:\/\/SpacesStore\/99564c35-6895-479f-a18d-9296e6902f3f",
      creator: {
         forename: "Ronald",
         surname: "Allen",
         username: "rallen"
      },
      created: "2014-07-18T04:55:57.000Z",
      modifier: {
         forename: "Jennifer",
         surname: "Hanson",
         username: "jhanson"
      },
      modified: "2015-04-20T01:59:46.000Z"
   }, {
      title: "Bury Transport Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/52756c58-e36b-4552-bbcf-22b5176a5659",
      creator: {
         forename: "Sandra",
         surname: "Rose",
         username: "srose"
      },
      created: "2013-09-04T00:48:10.000Z",
      modifier: {
         forename: "Louise",
         surname: "Garza",
         username: "lgarza"
      },
      modified: "2015-06-16T02:47:00.000Z"
   }, {
      title: "North East Derbyshire",
      nodeRef: "workspace:\/\/SpacesStore\/afe9f0e4-46a8-4a4d-979e-a31c3596f1b8",
      creator: {
         forename: "Jose",
         surname: "Reyes",
         username: "jreyes"
      },
      created: "2014-02-04T03:57:38.000Z",
      modifier: {
         forename: "Brian",
         surname: "Hunter",
         username: "bhunter"
      },
      modified: "2014-09-24T17:21:16.000Z"
   }, {
      title: "ODA British Council",
      nodeRef: "workspace:\/\/SpacesStore\/35b48774-2caa-4d7c-8475-dc5cc6f46b79",
      creator: {
         forename: "Jacqueline",
         surname: "Bishop",
         username: "jbishop"
      },
      created: "2014-03-27T22:42:23.000Z",
      modifier: {
         forename: "Robert",
         surname: "Hunter",
         username: "rhunter"
      },
      modified: "2015-01-15T12:32:52.000Z"
   }, {
      title: "Electoral divisions map",
      nodeRef: "workspace:\/\/SpacesStore\/acb7c7a8-d98c-4531-8af4-0ea956e99e26",
      creator: {
         forename: "Amanda",
         surname: "Webb",
         username: "awebb"
      },
      created: "2014-02-22T05:06:58.000Z",
      modifier: {
         forename: "Elizabeth",
         surname: "Porter",
         username: "eporter"
      },
      modified: "2014-12-06T21:19:24.000Z"
   }, {
      title: "HM Treasury Gas use",
      nodeRef: "workspace:\/\/SpacesStore\/4c390166-4f89-47f8-b7f1-d3d78512854f",
      creator: {
         forename: "Peter",
         surname: "Coleman",
         username: "pcoleman"
      },
      created: "2013-11-16T22:31:30.000Z",
      modifier: {
         forename: "Jimmy",
         surname: "Medina",
         username: "jmedina"
      },
      modified: "2015-06-07T22:49:04.000Z"
   }, {
      title: "Housebuilding Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/8ec76aea-e1d8-4040-a60b-8db9ee3075b6",
      creator: {
         forename: "Harold",
         surname: "Richardson",
         username: "hrichardson"
      },
      created: "2014-05-28T13:38:11.000Z",
      modifier: {
         forename: "Frances",
         surname: "Banks",
         username: "fbanks"
      },
      modified: "2015-02-14T15:20:16.000Z"
   }, {
      title: "Housing Stock Summary",
      nodeRef: "workspace:\/\/SpacesStore\/5670c406-1458-4635-87d5-f5107eb7e06e",
      creator: {
         forename: "Shirley",
         surname: "Berry",
         username: "sberry"
      },
      created: "2013-11-01T04:59:47.000Z",
      modifier: {
         forename: "Joan",
         surname: "Cox",
         username: "jcox"
      },
      modified: "2015-02-08T07:18:26.000Z"
   }, {
      title: "Oldham Transport Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/3163819d-d5c9-4f85-8654-ffa644567088",
      creator: {
         forename: "Gloria",
         surname: "Clark",
         username: "gclark"
      },
      created: "2014-04-24T07:50:26.000Z",
      modifier: {
         forename: "Catherine",
         surname: "Armstrong",
         username: "carmstrong"
      },
      modified: "2014-10-10T05:28:13.000Z"
   }, {
      title: "External applicants by age",
      nodeRef: "workspace:\/\/SpacesStore\/f96444a7-a18d-45f3-8be3-4c42c421ecbf",
      creator: {
         forename: "Eugene",
         surname: "Grant",
         username: "egrant"
      },
      created: "2014-08-17T17:51:20.000Z",
      modifier: {
         forename: "Matthew",
         surname: "Shaw",
         username: "mshaw"
      },
      modified: "2015-06-27T18:51:25.000Z"
   }, {
      title: "Business plan indicators",
      nodeRef: "workspace:\/\/SpacesStore\/ac72b45e-8592-4da0-b8c6-86fd141fe44f",
      creator: {
         forename: "Frances",
         surname: "Sanchez",
         username: "fsanchez"
      },
      created: "2014-04-11T07:17:28.000Z",
      modifier: {
         forename: "Daniel",
         surname: "King",
         username: "dking"
      },
      modified: "2014-10-03T11:36:02.000Z"
   }, {
      title: "Adult trend tables",
      nodeRef: "workspace:\/\/SpacesStore\/43fdaebe-d678-4d5a-8fc7-a13fda0e5ce1",
      creator: {
         forename: "Lillian",
         surname: "Alexander",
         username: "lalexander"
      },
      created: "2014-01-13T00:31:18.000Z",
      modifier: {
         forename: "Linda",
         surname: "Matthews",
         username: "lmatthews"
      },
      modified: "2015-08-16T15:10:20.000Z"
   }, {
      title: "Tower Hamlets",
      nodeRef: "workspace:\/\/SpacesStore\/44fe8a31-d406-45c0-bb20-967f706b4f44",
      creator: {
         forename: "Lillian",
         surname: "Kelley",
         username: "lkelley"
      },
      created: "2014-07-14T20:42:22.000Z",
      modifier: {
         forename: "Katherine",
         surname: "Duncan",
         username: "kduncan"
      },
      modified: "2014-12-06T19:56:21.000Z"
   }, {
      title: "Transparency data at HEFCE",
      nodeRef: "workspace:\/\/SpacesStore\/a0a69260-c6d7-4c4c-bab3-b291de922329",
      creator: {
         forename: "Elizabeth",
         surname: "Perez",
         username: "eperez"
      },
      created: "2013-10-15T12:24:28.000Z",
      modifier: {
         forename: "Janice",
         surname: "Martin",
         username: "jmartin"
      },
      modified: "2015-08-11T14:26:29.000Z"
   }, {
      title: "Hospital Consultants in England",
      nodeRef: "workspace:\/\/SpacesStore\/4f294ed8-a68d-4ad0-82a1-3157ff4facd2",
      creator: {
         forename: "Donna",
         surname: "Parker",
         username: "dparker"
      },
      created: "2013-10-02T18:12:15.000Z",
      modifier: {
         forename: "Cheryl",
         surname: "Ray",
         username: "cray"
      },
      modified: "2014-10-29T12:56:06.000Z"
   }, {
      title: "Procurement Contracts",
      nodeRef: "workspace:\/\/SpacesStore\/2cc3467d-832e-43d7-91e9-9f3dc9c3fdf1",
      creator: {
         forename: "Debra",
         surname: "Burke",
         username: "dburke"
      },
      created: "2014-05-20T13:21:26.000Z",
      modifier: {
         forename: "Raymond",
         surname: "Oliver",
         username: "roliver"
      },
      modified: "2014-12-05T07:35:16.000Z"
   }, {
      title: "Community centres",
      nodeRef: "workspace:\/\/SpacesStore\/f7c3b6d0-6b0c-45ee-9cba-c8ad9b04cde5",
      creator: {
         forename: "Ruth",
         surname: "Reyes",
         username: "rreyes"
      },
      created: "2014-06-23T16:06:50.000Z",
      modifier: {
         forename: "Deborah",
         surname: "Torres",
         username: "dtorres"
      },
      modified: "2014-10-06T14:06:01.000Z"
   }, {
      title: "Hampshire Long Distance Routes",
      nodeRef: "workspace:\/\/SpacesStore\/2caf2cf6-e707-477c-b977-44e1207737d7",
      creator: {
         forename: "Wayne",
         surname: "Martinez",
         username: "wmartinez"
      },
      created: "2013-11-20T20:25:09.000Z",
      modifier: {
         forename: "Jeffrey",
         surname: "Stanley",
         username: "jstanley"
      },
      modified: "2015-08-17T18:03:32.000Z"
   }, {
      title: "Procurement Transparency",
      nodeRef: "workspace:\/\/SpacesStore\/fdcc0050-6e4a-43cd-8f23-5878b13608f1",
      creator: {
         forename: "Lillian",
         surname: "Thompson",
         username: "lthompson"
      },
      created: "2014-08-03T18:16:47.000Z",
      modifier: {
         forename: "Thomas",
         surname: "Rose",
         username: "trose"
      },
      modified: "2014-11-10T11:27:34.000Z"
   }, {
      title: "HSCIC Social Care",
      nodeRef: "workspace:\/\/SpacesStore\/8bd18079-2936-46f6-9dd1-818aea73af59",
      creator: {
         forename: "Janice",
         surname: "Black",
         username: "jblack"
      },
      created: "2014-08-14T00:07:07.000Z",
      modifier: {
         forename: "Carlos",
         surname: "Martin",
         username: "cmartin"
      },
      modified: "2015-01-22T21:00:27.000Z"
   }, {
      title: "Community Directory homepage",
      nodeRef: "workspace:\/\/SpacesStore\/bcbf17cf-ef54-405f-9db6-6be79f4b1b9b",
      creator: {
         forename: "Matthew",
         surname: "Vasquez",
         username: "mvasquez"
      },
      created: "2014-02-27T23:30:22.000Z",
      modifier: {
         forename: "Louise",
         surname: "Stephens",
         username: "lstephens"
      },
      modified: "2015-04-18T06:55:52.000Z"
   }, {
      title: "Pharmacy headquarters",
      nodeRef: "workspace:\/\/SpacesStore\/b2e7362a-2cc6-4257-9630-656fb3dbb0da",
      creator: {
         forename: "Diane",
         surname: "Davis",
         username: "ddavis"
      },
      created: "2014-06-12T09:28:37.000Z",
      modifier: {
         forename: "Justin",
         surname: "Torres",
         username: "jtorres"
      },
      modified: "2015-04-19T22:24:26.000Z"
   }, {
      title: "Public health funeral data",
      nodeRef: "workspace:\/\/SpacesStore\/9e9bd8e8-e626-4d7f-bf77-8337c9597dab",
      creator: {
         forename: "Maria",
         surname: "George",
         username: "mgeorge"
      },
      created: "2013-10-19T18:09:16.000Z",
      modifier: {
         forename: "Alice",
         surname: "Turner",
         username: "aturner"
      },
      modified: "2015-02-11T23:02:41.000Z"
   }, {
      title: "GPC Country Identifier Codes",
      nodeRef: "workspace:\/\/SpacesStore\/5f012e13-03a3-46d9-bb4e-21471186ff1f",
      creator: {
         forename: "Robert",
         surname: "Mccoy",
         username: "rmccoy"
      },
      created: "2014-02-09T21:39:27.000Z",
      modifier: {
         forename: "Billy",
         surname: "King",
         username: "bking"
      },
      modified: "2014-10-13T10:21:02.000Z"
   }, {
      title: "Estates service delivery plan",
      nodeRef: "workspace:\/\/SpacesStore\/bb062451-edc8-4897-8c1f-9966143ce824",
      creator: {
         forename: "Kelly",
         surname: "Dixon",
         username: "kdixon"
      },
      created: "2014-03-22T16:15:11.000Z",
      modifier: {
         forename: "Karen",
         surname: "Perkins",
         username: "kperkins"
      },
      modified: "2015-07-29T02:08:20.000Z"
   }, {
      title: "Illustrative FTC template",
      nodeRef: "workspace:\/\/SpacesStore\/e1e876ee-1db3-4c0d-959e-30335198d917",
      creator: {
         forename: "Ralph",
         surname: "Perry",
         username: "rperry"
      },
      created: "2013-11-06T13:36:44.000Z",
      modifier: {
         forename: "Howard",
         surname: "Shaw",
         username: "hshaw"
      },
      modified: "2014-10-18T12:19:58.000Z"
   }, {
      title: "SSNAP Homepage",
      nodeRef: "workspace:\/\/SpacesStore\/52310c38-7c44-4a80-b1cd-5bd628edd769",
      creator: {
         forename: "Ruth",
         surname: "Gonzalez",
         username: "rgonzalez"
      },
      created: "2014-01-21T02:27:26.000Z",
      modifier: {
         forename: "Janice",
         surname: "Reyes",
         username: "jreyes"
      },
      modified: "2015-02-16T19:14:16.000Z"
   }, {
      title: "Planning Application Schema",
      nodeRef: "workspace:\/\/SpacesStore\/c4a2d1c9-80ed-4ced-b251-0bb14c7200d0",
      creator: {
         forename: "George",
         surname: "Jacobs",
         username: "gjacobs"
      },
      created: "2014-01-01T17:02:15.000Z",
      modifier: {
         forename: "Christina",
         surname: "Harrison",
         username: "charrison"
      },
      modified: "2014-08-31T01:41:10.000Z"
   }, {
      title: "Police force area",
      nodeRef: "workspace:\/\/SpacesStore\/64f77e4b-455e-4980-b2fa-1b07393c20bf",
      creator: {
         forename: "Carlos",
         surname: "Moreno",
         username: "cmoreno"
      },
      created: "2014-02-12T15:59:38.000Z",
      modifier: {
         forename: "Janice",
         surname: "Bailey",
         username: "jbailey"
      },
      modified: "2015-04-04T21:26:10.000Z"
   }, {
      title: "Translation Costs",
      nodeRef: "workspace:\/\/SpacesStore\/4a7da3d4-30a8-4f70-b02c-ff6ed14c538c",
      creator: {
         forename: "Denise",
         surname: "Oliver",
         username: "doliver"
      },
      created: "2013-11-03T10:43:16.000Z",
      modifier: {
         forename: "Peter",
         surname: "Morales",
         username: "pmorales"
      },
      modified: "2014-09-25T18:01:00.000Z"
   }, {
      title: "Rhondda Cynon Taf",
      nodeRef: "workspace:\/\/SpacesStore\/cd5a079d-75f6-42f8-a60d-c8488e828f41",
      creator: {
         forename: "Albert",
         surname: "Ramirez",
         username: "aramirez"
      },
      created: "2013-11-10T04:56:44.000Z",
      modifier: {
         forename: "Ann",
         surname: "Washington",
         username: "awashington"
      },
      modified: "2015-02-07T19:22:26.000Z"
   }, {
      title: "Capital and other commitments",
      nodeRef: "workspace:\/\/SpacesStore\/6ec0c8ed-227b-4f6b-ae26-1e69def854c4",
      creator: {
         forename: "Christopher",
         surname: "Coleman",
         username: "ccoleman"
      },
      created: "2014-04-29T07:00:36.000Z",
      modifier: {
         forename: "Paul",
         surname: "Williamson",
         username: "pwilliamson"
      },
      modified: "2015-05-27T02:24:30.000Z"
   }, {
      title: "File description",
      nodeRef: "workspace:\/\/SpacesStore\/3de50169-6c6c-47a4-8a81-a84b433be009",
      creator: {
         forename: "Raymond",
         surname: "Cooper",
         username: "rcooper"
      },
      created: "2014-02-04T09:26:07.000Z",
      modifier: {
         forename: "Joe",
         surname: "Ferguson",
         username: "jferguson"
      },
      modified: "2015-01-27T01:06:34.000Z"
   }, {
      title: "Appointments by disability",
      nodeRef: "workspace:\/\/SpacesStore\/a43d7bda-8403-40e7-ba3d-2a56c2f55d50",
      creator: {
         forename: "Harry",
         surname: "Nguyen",
         username: "hnguyen"
      },
      created: "2014-05-01T16:07:42.000Z",
      modifier: {
         forename: "Antonio",
         surname: "Foster",
         username: "afoster"
      },
      modified: "2015-06-22T01:12:20.000Z"
   }, {
      title: "UK Blue Flag Beaches",
      nodeRef: "workspace:\/\/SpacesStore\/9dec3e02-bb77-4c23-ba4f-3f5d9e1c560e",
      creator: {
         forename: "Diane",
         surname: "Young",
         username: "dyoung"
      },
      created: "2013-09-09T21:50:08.000Z",
      modifier: {
         forename: "Anthony",
         surname: "Oliver",
         username: "aoliver"
      },
      modified: "2014-08-23T23:23:23.000Z"
   }, {
      title: "Shetland Islands",
      nodeRef: "workspace:\/\/SpacesStore\/83c4ce48-dfdd-42ab-9ea4-8d7779e1bb48",
      creator: {
         forename: "Kathleen",
         surname: "Gibson",
         username: "kgibson"
      },
      created: "2014-02-11T07:00:36.000Z",
      modifier: {
         forename: "Adam",
         surname: "Ross",
         username: "aross"
      },
      modified: "2015-05-28T09:27:34.000Z"
   }, {
      title: "Conservation Area Metadata",
      nodeRef: "workspace:\/\/SpacesStore\/9be5c189-8c0f-482f-b3dd-0dc658e50ac0",
      creator: {
         forename: "Bonnie",
         surname: "Jordan",
         username: "bjordan"
      },
      created: "2014-01-24T21:20:02.000Z",
      modifier: {
         forename: "Jacqueline",
         surname: "Mitchell",
         username: "jmitchell"
      },
      modified: "2015-06-10T01:29:06.000Z"
   }, {
      title: "National Lung Cancer Audit",
      nodeRef: "workspace:\/\/SpacesStore\/88e6556d-1a14-448b-a9ad-baafd647ae1c",
      creator: {
         forename: "Stephen",
         surname: "Moreno",
         username: "smoreno"
      },
      created: "2014-03-25T15:33:02.000Z",
      modifier: {
         forename: "Clarence",
         surname: "Mason",
         username: "cmason"
      },
      modified: "2014-09-17T20:40:06.000Z"
   }, {
      title: "South Staffordshire",
      nodeRef: "workspace:\/\/SpacesStore\/7bf799f4-5393-4337-9754-26ebca745da4",
      creator: {
         forename: "Edward",
         surname: "Martinez",
         username: "emartinez"
      },
      created: "2013-10-12T06:02:49.000Z",
      modifier: {
         forename: "Keith",
         surname: "Garrett",
         username: "kgarrett"
      },
      modified: "2015-01-05T19:22:37.000Z"
   }, {
      title: "Immigration and asylum appeals",
      nodeRef: "workspace:\/\/SpacesStore\/aaa06c53-2704-4ef0-a808-9cfb381e0e73",
      creator: {
         forename: "David",
         surname: "Smith",
         username: "dsmith"
      },
      created: "2014-03-07T01:16:31.000Z",
      modifier: {
         forename: "Jimmy",
         surname: "Armstrong",
         username: "jarmstrong"
      },
      modified: "2014-10-02T21:47:53.000Z"
   }, {
      title: "National Greenspace Map WMS",
      nodeRef: "workspace:\/\/SpacesStore\/0959500b-5511-42a2-956e-0ce350b596d7",
      creator: {
         forename: "Victor",
         surname: "Sullivan",
         username: "vsullivan"
      },
      created: "2014-06-26T17:19:53.000Z",
      modifier: {
         forename: "Louise",
         surname: "Gomez",
         username: "lgomez"
      },
      modified: "2015-02-28T19:38:43.000Z"
   }, {
      title: "Organogram Series",
      nodeRef: "workspace:\/\/SpacesStore\/a5b6f845-8175-43a2-8174-cb98a3997a30",
      creator: {
         forename: "Adam",
         surname: "Graham",
         username: "agraham"
      },
      created: "2014-07-02T09:16:31.000Z",
      modifier: {
         forename: "Rebecca",
         surname: "Harris",
         username: "rharris"
      },
      modified: "2015-05-09T15:36:05.000Z"
   }, {
      title: "Detailed Transition Plan",
      nodeRef: "workspace:\/\/SpacesStore\/6bf1e911-827f-4aea-b945-e10ac70788b8",
      creator: {
         forename: "Amy",
         surname: "Hansen",
         username: "ahansen"
      },
      created: "2014-03-29T19:49:34.000Z",
      modifier: {
         forename: "Amanda",
         surname: "Gutierrez",
         username: "agutierrez"
      },
      modified: "2014-11-23T04:20:54.000Z"
   }, {
      title: "Remuneration for board members",
      nodeRef: "workspace:\/\/SpacesStore\/9d00010a-9d17-4e30-9cd4-1563749abf29",
      creator: {
         forename: "Melissa",
         surname: "Gardner",
         username: "mgardner"
      },
      created: "2014-03-27T07:35:56.000Z",
      modifier: {
         forename: "Edward",
         surname: "Kim",
         username: "ekim"
      },
      modified: "2014-09-17T16:16:19.000Z"
   }, {
      title: "Meusydd Parcio Zip",
      nodeRef: "workspace:\/\/SpacesStore\/01fd008e-ba71-4e71-b1fe-9b65f1799e49",
      creator: {
         forename: "Nancy",
         surname: "Gonzales",
         username: "ngonzales"
      },
      created: "2014-05-20T00:43:13.000Z",
      modifier: {
         forename: "Jonathan",
         surname: "Hayes",
         username: "jhayes"
      },
      modified: "2014-11-25T13:48:01.000Z"
   }, {
      title: "Resource locator",
      nodeRef: "workspace:\/\/SpacesStore\/3821de4b-3979-42cf-8e54-9c5c60ec4f1b",
      creator: {
         forename: "Raymond",
         surname: "Hawkins",
         username: "rhawkins"
      },
      created: "2013-12-24T12:37:28.000Z",
      modifier: {
         forename: "Amanda",
         surname: "Kim",
         username: "akim"
      },
      modified: "2014-08-30T22:20:49.000Z"
   }, {
      title: "College Accounts cvs",
      nodeRef: "workspace:\/\/SpacesStore\/32c924aa-6be7-455b-9770-fccf568381c2",
      creator: {
         forename: "Dorothy",
         surname: "Sims",
         username: "dsims"
      },
      created: "2014-08-09T13:36:47.000Z",
      modifier: {
         forename: "Lois",
         surname: "Marshall",
         username: "lmarshall"
      },
      modified: "2015-01-06T17:37:37.000Z"
   }, {
      title: "Constitution of Council",
      nodeRef: "workspace:\/\/SpacesStore\/adb7df3d-ce07-44ea-a94e-a17814ac4e5f",
      creator: {
         forename: "David",
         surname: "Gardner",
         username: "dgardner"
      },
      created: "2013-10-26T21:59:57.000Z",
      modifier: {
         forename: "Earl",
         surname: "Montgomery",
         username: "emontgomery"
      },
      modified: "2015-03-23T13:23:55.000Z"
   }, {
      title: "Organisational Chart",
      nodeRef: "workspace:\/\/SpacesStore\/f1aaabe7-0fee-4596-966e-9d53d1c4c706",
      creator: {
         forename: "Judy",
         surname: "Bishop",
         username: "jbishop"
      },
      created: "2014-05-27T16:18:29.000Z",
      modifier: {
         forename: "Nicole",
         surname: "Burke",
         username: "nburke"
      },
      modified: "2015-04-19T13:46:25.000Z"
   }, {
      title: "Air Quality Management Area",
      nodeRef: "workspace:\/\/SpacesStore\/6753695e-ab98-4381-859c-e76edc42195a",
      creator: {
         forename: "Aaron",
         surname: "Alvarez",
         username: "aalvarez"
      },
      created: "2013-09-07T01:05:21.000Z",
      modifier: {
         forename: "Teresa",
         surname: "Wright",
         username: "twright"
      },
      modified: "2015-06-27T09:27:06.000Z"
   }, {
      title: "Grievance cases",
      nodeRef: "workspace:\/\/SpacesStore\/abeb6470-986b-4635-b3ba-ae016fa18f27",
      creator: {
         forename: "Theresa",
         surname: "Turner",
         username: "tturner"
      },
      created: "2013-12-27T12:45:10.000Z",
      modifier: {
         forename: "Helen",
         surname: "Bennett",
         username: "hbennett"
      },
      modified: "2015-01-29T08:11:54.000Z"
   }, {
      title: "Defence Equipment and Support",
      nodeRef: "workspace:\/\/SpacesStore\/190cfacb-c3aa-4a34-9673-d982fdae5eb1",
      creator: {
         forename: "Howard",
         surname: "Berry",
         username: "hberry"
      },
      created: "2014-06-25T01:50:49.000Z",
      modifier: {
         forename: "Sarah",
         surname: "Rose",
         username: "srose"
      },
      modified: "2015-03-19T05:34:29.000Z"
   }, {
      title: "PDF publication",
      nodeRef: "workspace:\/\/SpacesStore\/26bf59fc-a27e-42ae-b09e-95821bc79fbc",
      creator: {
         forename: "Mark",
         surname: "Henderson",
         username: "mhenderson"
      },
      created: "2014-04-29T01:40:11.000Z",
      modifier: {
         forename: "Frank",
         surname: "Bell",
         username: "fbell"
      },
      modified: "2014-10-22T11:18:45.000Z"
   }, {
      title: "Channels in Devon JSON",
      nodeRef: "workspace:\/\/SpacesStore\/64642863-8d7c-4f0a-b43c-1eac0e66c81d",
      creator: {
         forename: "Earl",
         surname: "Edwards",
         username: "eedwards"
      },
      created: "2013-11-22T13:36:04.000Z",
      modifier: {
         forename: "Sean",
         surname: "Martinez",
         username: "smartinez"
      },
      modified: "2015-02-07T17:09:30.000Z"
   }, {
      title: "RBWM budget monitoring",
      nodeRef: "workspace:\/\/SpacesStore\/ef0e35bf-915d-42b4-88e9-80931835beb4",
      creator: {
         forename: "Ruby",
         surname: "Perry",
         username: "rperry"
      },
      created: "2013-10-19T22:24:32.000Z",
      modifier: {
         forename: "Janet",
         surname: "Roberts",
         username: "jroberts"
      },
      modified: "2014-09-15T21:21:12.000Z"
   }, {
      title: "Fenland",
      nodeRef: "workspace:\/\/SpacesStore\/99937ffd-4862-46d4-b5e2-043272a6fc04",
      creator: {
         forename: "Helen",
         surname: "Russell",
         username: "hrussell"
      },
      created: "2014-08-03T15:27:48.000Z",
      modifier: {
         forename: "Walter",
         surname: "Berry",
         username: "wberry"
      },
      modified: "2015-03-03T20:58:25.000Z"
   }, {
      title: "NHS Workforce Turnover",
      nodeRef: "workspace:\/\/SpacesStore\/c83d3e66-f505-4805-a52f-6dcc6d5e0a8d",
      creator: {
         forename: "Albert",
         surname: "Romero",
         username: "aromero"
      },
      created: "2013-12-09T15:29:28.000Z",
      modifier: {
         forename: "Ronald",
         surname: "Wagner",
         username: "rwagner"
      },
      modified: "2014-10-12T12:11:02.000Z"
   }, {
      title: "HES Data Dictionary",
      nodeRef: "workspace:\/\/SpacesStore\/245ee6d6-f3eb-4cee-83a8-2531cf108f4d",
      creator: {
         forename: "Anna",
         surname: "Johnson",
         username: "ajohnson"
      },
      created: "2013-12-29T17:54:04.000Z",
      modifier: {
         forename: "Alan",
         surname: "Edwards",
         username: "aedwards"
      },
      modified: "2014-11-22T16:55:25.000Z"
   }, {
      title: "Suffolk Coastal",
      nodeRef: "workspace:\/\/SpacesStore\/69a1d98b-0949-4078-a5be-e2838ef9638f",
      creator: {
         forename: "Dennis",
         surname: "Robinson",
         username: "drobinson"
      },
      created: "2014-04-01T15:40:44.000Z",
      modifier: {
         forename: "Patricia",
         surname: "Cox",
         username: "pcox"
      },
      modified: "2014-11-23T02:58:46.000Z"
   }, {
      title: "Organisational structure",
      nodeRef: "workspace:\/\/SpacesStore\/cfa044ae-cded-4bfa-85f2-840b67b06660",
      creator: {
         forename: "Andrew",
         surname: "Sullivan",
         username: "asullivan"
      },
      created: "2013-12-04T22:46:08.000Z",
      modifier: {
         forename: "Kevin",
         surname: "Lee",
         username: "klee"
      },
      modified: "2015-01-09T00:08:35.000Z"
   }, {
      title: "PDF map",
      nodeRef: "workspace:\/\/SpacesStore\/1c026324-856f-401e-8e08-407ec35eccf9",
      creator: {
         forename: "Diana",
         surname: "Perry",
         username: "dperry"
      },
      created: "2013-10-08T21:36:23.000Z",
      modifier: {
         forename: "Judy",
         surname: "Harris",
         username: "jharris"
      },
      modified: "2014-12-10T22:49:06.000Z"
   }, {
      title: "Minerals Survey",
      nodeRef: "workspace:\/\/SpacesStore\/5c3d09c8-1d29-4fa4-b9d5-1eaf985d5856",
      creator: {
         forename: "Phillip",
         surname: "Freeman",
         username: "pfreeman"
      },
      created: "2013-09-29T20:58:46.000Z",
      modifier: {
         forename: "Janice",
         surname: "Cox",
         username: "jcox"
      },
      modified: "2015-01-31T14:25:24.000Z"
   }, {
      title: "Glasgow City",
      nodeRef: "workspace:\/\/SpacesStore\/61633087-4cd6-4a75-ac6d-eab1e5d9308c",
      creator: {
         forename: "Christopher",
         surname: "Moreno",
         username: "cmoreno"
      },
      created: "2013-12-26T06:21:22.000Z",
      modifier: {
         forename: "Bruce",
         surname: "Berry",
         username: "bberry"
      },
      modified: "2014-10-04T05:41:57.000Z"
   }, {
      title: "Freehold Ownership",
      nodeRef: "workspace:\/\/SpacesStore\/4ebca69f-4165-42f9-977e-06208c65fd59",
      creator: {
         forename: "Joan",
         surname: "Chavez",
         username: "jchavez"
      },
      created: "2013-12-16T15:18:42.000Z",
      modifier: {
         forename: "Irene",
         surname: "Bell",
         username: "ibell"
      },
      modified: "2014-08-21T00:41:52.000Z"
   }, {
      title: "Hypothyroidism data tables",
      nodeRef: "workspace:\/\/SpacesStore\/ef92d9cb-3ba0-49a5-b1cb-408390d9411e",
      creator: {
         forename: "Julie",
         surname: "Hall",
         username: "jhall"
      },
      created: "2014-07-12T17:46:33.000Z",
      modifier: {
         forename: "Douglas",
         surname: "Freeman",
         username: "dfreeman"
      },
      modified: "2015-04-22T11:43:50.000Z"
   }, {
      title: "Customer Services contact enquiries",
      nodeRef: "workspace:\/\/SpacesStore\/59ce665a-28ee-4446-99cc-23d36be33e7c",
      creator: {
         forename: "Carolyn",
         surname: "Stevens",
         username: "cstevens"
      },
      created: "2013-11-20T23:11:46.000Z",
      modifier: {
         forename: "Theresa",
         surname: "Cole",
         username: "tcole"
      },
      modified: "2014-11-06T23:50:06.000Z"
   }, {
      title: "Barking and Dagenham",
      nodeRef: "workspace:\/\/SpacesStore\/227bcae5-8c9d-4ebd-a966-37d16ac12dab",
      creator: {
         forename: "Dorothy",
         surname: "Mcdonald",
         username: "dmcdonald"
      },
      created: "2014-05-16T05:27:36.000Z",
      modifier: {
         forename: "Arthur",
         surname: "Mccoy",
         username: "amccoy"
      },
      modified: "2014-08-31T09:57:03.000Z"
   }, {
      title: "Gifts received by special advisers",
      nodeRef: "workspace:\/\/SpacesStore\/97a41e64-1869-44d7-abd9-6ad62039bd8d",
      creator: {
         forename: "Linda",
         surname: "Phillips",
         username: "lphillips"
      },
      created: "2014-01-27T03:15:17.000Z",
      modifier: {
         forename: "Michael",
         surname: "Turner",
         username: "mturner"
      },
      modified: "2014-12-20T13:57:30.000Z"
   }, {
      title: "NICOR transparency agenda pages",
      nodeRef: "workspace:\/\/SpacesStore\/6b0eee1b-a26d-4c20-9599-806cbef5cf49",
      creator: {
         forename: "Sandra",
         surname: "Murphy",
         username: "smurphy"
      },
      created: "2014-06-29T21:21:03.000Z",
      modifier: {
         forename: "Tina",
         surname: "Reyes",
         username: "treyes"
      },
      modified: "2015-02-04T17:23:35.000Z"
   }, {
      title: "Calderdale Grants",
      nodeRef: "workspace:\/\/SpacesStore\/b5febeb5-4cb7-4be2-b9a9-326646d9f046",
      creator: {
         forename: "Judy",
         surname: "Ward",
         username: "jward"
      },
      created: "2014-08-14T06:37:56.000Z",
      modifier: {
         forename: "Frances",
         surname: "Gray",
         username: "fgray"
      },
      modified: "2015-04-14T17:13:01.000Z"
   }, {
      title: "National Vascular Registry",
      nodeRef: "workspace:\/\/SpacesStore\/c2b3b7ce-227a-421b-b22b-af7e0572d80e",
      creator: {
         forename: "Joan",
         surname: "Porter",
         username: "jporter"
      },
      created: "2013-12-21T17:24:11.000Z",
      modifier: {
         forename: "Kimberly",
         surname: "Thomas",
         username: "kthomas"
      },
      modified: "2014-11-24T18:45:18.000Z"
   }, {
      title: "Civil Service People Surveys",
      nodeRef: "workspace:\/\/SpacesStore\/b4f6b4b1-0662-4121-bf98-80816a53ae9a",
      creator: {
         forename: "Ruby",
         surname: "Duncan",
         username: "rduncan"
      },
      created: "2014-03-16T01:20:36.000Z",
      modifier: {
         forename: "Elizabeth",
         surname: "Hanson",
         username: "ehanson"
      },
      modified: "2015-03-13T22:37:52.000Z"
   }, {
      title: "CMR SCO telecoms data",
      nodeRef: "workspace:\/\/SpacesStore\/dc32d9fd-0d44-4511-b5a2-e73c8ace3fa4",
      creator: {
         forename: "Jack",
         surname: "Harris",
         username: "jharris"
      },
      created: "2014-05-20T21:56:04.000Z",
      modifier: {
         forename: "David",
         surname: "Watson",
         username: "dwatson"
      },
      modified: "2015-04-03T10:58:35.000Z"
   }, {
      title: "Council tax charges",
      nodeRef: "workspace:\/\/SpacesStore\/341b876d-da72-4fb5-8cc8-3d1f2edbbc01",
      creator: {
         forename: "Martha",
         surname: "Watson",
         username: "mwatson"
      },
      created: "2013-12-19T12:36:08.000Z",
      modifier: {
         forename: "David",
         surname: "Reyes",
         username: "dreyes"
      },
      modified: "2015-02-22T00:31:42.000Z"
   }, {
      title: "Statistics on Smoking",
      nodeRef: "workspace:\/\/SpacesStore\/760ccb3a-7b7c-4f9a-bccd-b6d6a9a705fe",
      creator: {
         forename: "Carolyn",
         surname: "Day",
         username: "cday"
      },
      created: "2013-11-15T07:28:38.000Z",
      modifier: {
         forename: "Anne",
         surname: "Shaw",
         username: "ashaw"
      },
      modified: "2015-03-17T09:14:53.000Z"
   }, {
      title: "Primary school place allocations",
      nodeRef: "workspace:\/\/SpacesStore\/d5ba8096-5151-45da-bc2e-f2490bc1092a",
      creator: {
         forename: "Bobby",
         surname: "King",
         username: "bking"
      },
      created: "2014-02-11T09:24:24.000Z",
      modifier: {
         forename: "Jessica",
         surname: "Medina",
         username: "jmedina"
      },
      modified: "2015-05-30T19:56:49.000Z"
   }, {
      title: "Senior Employees",
      nodeRef: "workspace:\/\/SpacesStore\/8e83876f-9fcc-434c-b0ab-d3f1632f1f03",
      creator: {
         forename: "Bobby",
         surname: "White",
         username: "bwhite"
      },
      created: "2014-08-11T11:00:25.000Z",
      modifier: {
         forename: "Donald",
         surname: "Cruz",
         username: "dcruz"
      },
      modified: "2014-11-08T10:24:50.000Z"
   }, {
      title: "Defra Biodiversity page",
      nodeRef: "workspace:\/\/SpacesStore\/bbdc5e3f-41b7-4311-9242-0ca360e7d10f",
      creator: {
         forename: "Pamela",
         surname: "Bailey",
         username: "pbailey"
      },
      created: "2014-05-24T00:53:09.000Z",
      modifier: {
         forename: "Roy",
         surname: "Wright",
         username: "rwright"
      },
      modified: "2014-12-03T18:30:50.000Z"
   }, {
      title: "June transactions",
      nodeRef: "workspace:\/\/SpacesStore\/74a6bf5d-91b8-4494-a38e-69b127deb6f3",
      creator: {
         forename: "Nicholas",
         surname: "Snyder",
         username: "nsnyder"
      },
      created: "2013-08-23T21:03:57.000Z",
      modifier: {
         forename: "Janice",
         surname: "Patterson",
         username: "jpatterson"
      },
      modified: "2014-10-21T15:20:35.000Z"
   }, {
      title: "Norwich City",
      nodeRef: "workspace:\/\/SpacesStore\/c09ab5d5-8e4e-46fd-8bdc-eaa1cf1682b8",
      creator: {
         forename: "Ralph",
         surname: "Hudson",
         username: "rhudson"
      },
      created: "2014-08-03T03:06:27.000Z",
      modifier: {
         forename: "Richard",
         surname: "Mccoy",
         username: "rmccoy"
      },
      modified: "2014-11-13T10:13:14.000Z"
   }, {
      title: "Derby City",
      nodeRef: "workspace:\/\/SpacesStore\/bae5294b-e9e4-4458-b558-a97d008554db",
      creator: {
         forename: "Melissa",
         surname: "Arnold",
         username: "marnold"
      },
      created: "2014-02-07T10:13:40.000Z",
      modifier: {
         forename: "Amy",
         surname: "Carter",
         username: "acarter"
      },
      modified: "2014-12-24T11:35:04.000Z"
   }, {
      title: "Quarterly Amendment files",
      nodeRef: "workspace:\/\/SpacesStore\/cca69afc-45f3-4e4e-8b8c-507eab01be6a",
      creator: {
         forename: "Billy",
         surname: "Gordon",
         username: "bgordon"
      },
      created: "2014-07-10T10:09:34.000Z",
      modifier: {
         forename: "Anna",
         surname: "Austin",
         username: "aaustin"
      },
      modified: "2014-10-01T21:29:30.000Z"
   }, {
      title: "Oxford City",
      nodeRef: "workspace:\/\/SpacesStore\/0cc5cfc6-bf94-4b88-9225-6de8510d4d8e",
      creator: {
         forename: "Dennis",
         surname: "Parker",
         username: "dparker"
      },
      created: "2013-12-16T08:46:14.000Z",
      modifier: {
         forename: "Rachel",
         surname: "Reid",
         username: "rreid"
      },
      modified: "2015-08-18T12:59:03.000Z"
   }, {
      title: "External applicants by ethnicity",
      nodeRef: "workspace:\/\/SpacesStore\/a8d13c55-fe0d-4456-a01c-925a2feeeacf",
      creator: {
         forename: "Rachel",
         surname: "Gardner",
         username: "rgardner"
      },
      created: "2014-05-14T07:56:19.000Z",
      modifier: {
         forename: "Antonio",
         surname: "Garcia",
         username: "agarcia"
      },
      modified: "2014-09-28T06:58:46.000Z"
   }, {
      title: "Basingstoke and Deane",
      nodeRef: "workspace:\/\/SpacesStore\/29e80774-9fb8-43cf-adf8-e435e69bc129",
      creator: {
         forename: "Eric",
         surname: "Harvey",
         username: "eharvey"
      },
      created: "2014-05-25T09:31:24.000Z",
      modifier: {
         forename: "Nicholas",
         surname: "Diaz",
         username: "ndiaz"
      },
      modified: "2015-08-07T14:32:02.000Z"
   }, {
      title: "Prosecution data",
      nodeRef: "workspace:\/\/SpacesStore\/9ae15cfe-ab42-4b7b-af3f-364b261731d0",
      creator: {
         forename: "Lawrence",
         surname: "Smith",
         username: "lsmith"
      },
      created: "2013-11-12T08:08:46.000Z",
      modifier: {
         forename: "Henry",
         surname: "Welch",
         username: "hwelch"
      },
      modified: "2015-07-13T22:26:44.000Z"
   }, {
      title: "Tax Arrangements Publication",
      nodeRef: "workspace:\/\/SpacesStore\/5fd5d046-6426-4b3f-9176-a3c6c441c403",
      creator: {
         forename: "Raymond",
         surname: "Nelson",
         username: "rnelson"
      },
      created: "2014-02-07T14:57:38.000Z",
      modifier: {
         forename: "Keith",
         surname: "Wallace",
         username: "kwallace"
      },
      modified: "2015-02-13T09:09:43.000Z"
   }, {
      title: "Conservation volunteering",
      nodeRef: "workspace:\/\/SpacesStore\/ba22cc56-5333-43f9-b1b4-6036392f8e66",
      creator: {
         forename: "Jimmy",
         surname: "Clark",
         username: "jclark"
      },
      created: "2014-06-08T11:08:24.000Z",
      modifier: {
         forename: "Jason",
         surname: "Gilbert",
         username: "jgilbert"
      },
      modified: "2014-10-08T10:04:08.000Z"
   }, {
      title: "General Dental Practitioners",
      nodeRef: "workspace:\/\/SpacesStore\/4376a2ee-aa3a-4d70-b78b-05702130739a",
      creator: {
         forename: "Marie",
         surname: "Hart",
         username: "mhart"
      },
      created: "2013-11-11T01:30:54.000Z",
      modifier: {
         forename: "Carlos",
         surname: "Schmidt",
         username: "cschmidt"
      },
      modified: "2015-04-28T23:30:43.000Z"
   }, {
      title: "Resource Location",
      nodeRef: "workspace:\/\/SpacesStore\/509b4217-0379-4067-812b-3f21e35b1c3d",
      creator: {
         forename: "Karen",
         surname: "Graham",
         username: "kgraham"
      },
      created: "2013-11-09T20:01:32.000Z",
      modifier: {
         forename: "Jean",
         surname: "Morris",
         username: "jmorris"
      },
      modified: "2014-11-16T04:54:48.000Z"
   }, {
      title: "Independent Sector Healthcare Providers",
      nodeRef: "workspace:\/\/SpacesStore\/77e212bb-6ff1-4559-9f1b-46692e1f4f79",
      creator: {
         forename: "Nancy",
         surname: "Alexander",
         username: "nalexander"
      },
      created: "2014-01-31T13:07:40.000Z",
      modifier: {
         forename: "Andrea",
         surname: "Hansen",
         username: "ahansen"
      },
      modified: "2015-04-10T13:23:52.000Z"
   }, {
      title: "Sustainable fisheries",
      nodeRef: "workspace:\/\/SpacesStore\/2196506b-e0c2-41d9-aae2-7fcab49db51d",
      creator: {
         forename: "Maria",
         surname: "Smith",
         username: "msmith"
      },
      created: "2014-05-11T07:22:28.000Z",
      modifier: {
         forename: "Jane",
         surname: "Mendoza",
         username: "jmendoza"
      },
      modified: "2015-08-11T16:07:18.000Z"
   }, {
      title: "Child minders",
      nodeRef: "workspace:\/\/SpacesStore\/30a71109-248e-475e-8343-e767b7d1808b",
      creator: {
         forename: "Jeffrey",
         surname: "Stephens",
         username: "jstephens"
      },
      created: "2013-10-11T00:39:02.000Z",
      modifier: {
         forename: "Aaron",
         surname: "Jacobs",
         username: "ajacobs"
      },
      modified: "2014-12-18T04:33:19.000Z"
   }, {
      title: "Technology Strategy Board Salary",
      nodeRef: "workspace:\/\/SpacesStore\/0f6642f4-f87a-4575-b002-cd44a7841765",
      creator: {
         forename: "Martin",
         surname: "Garrett",
         username: "mgarrett"
      },
      created: "2014-07-01T13:55:49.000Z",
      modifier: {
         forename: "Lawrence",
         surname: "Fisher",
         username: "lfisher"
      },
      modified: "2014-09-04T15:01:38.000Z"
   }, {
      title: "Premises Licences",
      nodeRef: "workspace:\/\/SpacesStore\/cc99e577-e709-483f-a369-0ad6d6ba383a",
      creator: {
         forename: "Tammy",
         surname: "Montgomery",
         username: "tmontgomery"
      },
      created: "2014-01-26T09:21:43.000Z",
      modifier: {
         forename: "Richard",
         surname: "Bailey",
         username: "rbailey"
      },
      modified: "2015-05-31T07:06:59.000Z"
   }, {
      title: "Skips waste",
      nodeRef: "workspace:\/\/SpacesStore\/b32f0475-3d01-4b7e-ac45-9c848e2fc1a3",
      creator: {
         forename: "Bonnie",
         surname: "Scott",
         username: "bscott"
      },
      created: "2014-01-09T12:49:28.000Z",
      modifier: {
         forename: "Chris",
         surname: "Lewis",
         username: "clewis"
      },
      modified: "2015-07-02T03:12:26.000Z"
   }, {
      title: "NHS Staff Survey homepage",
      nodeRef: "workspace:\/\/SpacesStore\/dafca0b5-fd1b-4ec7-8f35-e0d2fa3175ce",
      creator: {
         forename: "Donald",
         surname: "Kelly",
         username: "dkelly"
      },
      created: "2013-10-06T01:28:14.000Z",
      modifier: {
         forename: "Maria",
         surname: "Ruiz",
         username: "mruiz"
      },
      modified: "2015-04-28T05:30:59.000Z"
   }, {
      title: "Parking Annual Report",
      nodeRef: "workspace:\/\/SpacesStore\/8abc8356-fa5a-426d-b2f8-6a7324ad69e6",
      creator: {
         forename: "Stephanie",
         surname: "Burns",
         username: "sburns"
      },
      created: "2014-06-18T22:03:17.000Z",
      modifier: {
         forename: "Dennis",
         surname: "Burke",
         username: "dburke"
      },
      modified: "2014-12-05T01:20:22.000Z"
   }, {
      title: "Further Local Plan Info",
      nodeRef: "workspace:\/\/SpacesStore\/8748f276-ca83-480f-9074-1c53fba76990",
      creator: {
         forename: "Roger",
         surname: "Allen",
         username: "rallen"
      },
      created: "2013-11-20T10:27:08.000Z",
      modifier: {
         forename: "Louise",
         surname: "Arnold",
         username: "larnold"
      },
      modified: "2014-10-24T06:45:55.000Z"
   }, {
      title: "Premises Licences Milton Keynes",
      nodeRef: "workspace:\/\/SpacesStore\/f638fb60-9ebe-49ae-9bb7-c4c1af546985",
      creator: {
         forename: "Joe",
         surname: "Sanders",
         username: "jsanders"
      },
      created: "2014-03-03T16:04:57.000Z",
      modifier: {
         forename: "Laura",
         surname: "Cooper",
         username: "lcooper"
      },
      modified: "2015-08-14T23:32:13.000Z"
   }, {
      title: "NHS England Innovation Scorecard",
      nodeRef: "workspace:\/\/SpacesStore\/ed548a44-eb25-44a3-a942-3a5cc894854b",
      creator: {
         forename: "Melissa",
         surname: "Gonzalez",
         username: "mgonzalez"
      },
      created: "2013-11-27T01:44:44.000Z",
      modifier: {
         forename: "Beverly",
         surname: "Young",
         username: "byoung"
      },
      modified: "2015-04-04T10:41:20.000Z"
   }, {
      title: "Local Government Incentive Scheme",
      nodeRef: "workspace:\/\/SpacesStore\/5c1680b7-db5b-4947-b6c2-ef8316357c71",
      creator: {
         forename: "Sarah",
         surname: "Larson",
         username: "slarson"
      },
      created: "2013-09-05T01:10:33.000Z",
      modifier: {
         forename: "Kenneth",
         surname: "Peters",
         username: "kpeters"
      },
      modified: "2015-02-19T07:58:59.000Z"
   }, {
      title: "Junior staff datasets",
      nodeRef: "workspace:\/\/SpacesStore\/48509740-d9a5-49be-85e3-0b4c6010a14d",
      creator: {
         forename: "Debra",
         surname: "Reid",
         username: "dreid"
      },
      created: "2013-12-16T00:46:03.000Z",
      modifier: {
         forename: "Kelly",
         surname: "King",
         username: "kking"
      },
      modified: "2015-03-07T02:28:59.000Z"
   }, {
      title: "Fords in Devon JSON",
      nodeRef: "workspace:\/\/SpacesStore\/d2bb3801-ccdf-49ff-ad83-a95d4483f6e8",
      creator: {
         forename: "Phyllis",
         surname: "Fox",
         username: "pfox"
      },
      created: "2014-03-13T05:17:08.000Z",
      modifier: {
         forename: "Craig",
         surname: "Jacobs",
         username: "cjacobs"
      },
      modified: "2015-04-29T15:11:29.000Z"
   }, {
      title: "Section B",
      nodeRef: "workspace:\/\/SpacesStore\/ba86a63f-8185-424c-bb31-df319b3fd9cf",
      creator: {
         forename: "Eric",
         surname: "Gordon",
         username: "egordon"
      },
      created: "2014-01-20T10:44:03.000Z",
      modifier: {
         forename: "Clarence",
         surname: "Edwards",
         username: "cedwards"
      },
      modified: "2014-12-13T09:47:50.000Z"
   }, {
      title: "Adapting to austerity report",
      nodeRef: "workspace:\/\/SpacesStore\/06cedf14-47ff-4bde-9035-f0e72de051a5",
      creator: {
         forename: "George",
         surname: "Carter",
         username: "gcarter"
      },
      created: "2014-07-08T06:21:49.000Z",
      modifier: {
         forename: "Albert",
         surname: "Banks",
         username: "abanks"
      },
      modified: "2014-08-25T00:40:46.000Z"
   }, {
      title: "Scottish Borders",
      nodeRef: "workspace:\/\/SpacesStore\/543cb145-78c7-4192-be6b-28d6f6bb8727",
      creator: {
         forename: "Gloria",
         surname: "Cruz",
         username: "gcruz"
      },
      created: "2013-11-06T02:42:18.000Z",
      modifier: {
         forename: "Denise",
         surname: "Gutierrez",
         username: "dgutierrez"
      },
      modified: "2014-11-09T10:20:38.000Z"
   }, {
      title: "RBWM contracts",
      nodeRef: "workspace:\/\/SpacesStore\/6ec7bfe7-5dc1-490a-aba0-e78cd4a039a6",
      creator: {
         forename: "Sarah",
         surname: "Graham",
         username: "sgraham"
      },
      created: "2014-04-19T22:15:55.000Z",
      modifier: {
         forename: "Nicholas",
         surname: "Wells",
         username: "nwells"
      },
      modified: "2015-07-22T14:04:23.000Z"
   }, {
      title: "HMRC Performance",
      nodeRef: "workspace:\/\/SpacesStore\/88156d73-63b1-43d0-aed9-b88deb233687",
      creator: {
         forename: "Ralph",
         surname: "Perry",
         username: "rperry"
      },
      created: "2013-12-16T23:46:39.000Z",
      modifier: {
         forename: "Wanda",
         surname: "Nguyen",
         username: "wnguyen"
      },
      modified: "2015-04-06T22:36:04.000Z"
   }, {
      title: "Transparency data",
      nodeRef: "workspace:\/\/SpacesStore\/7386637e-b696-433f-9a2e-43ea3113bb87",
      creator: {
         forename: "Wayne",
         surname: "Arnold",
         username: "warnold"
      },
      created: "2014-05-08T16:05:48.000Z",
      modifier: {
         forename: "Robert",
         surname: "Reynolds",
         username: "rreynolds"
      },
      modified: "2015-02-15T11:38:59.000Z"
   }, {
      title: "Contract body and schedules",
      nodeRef: "workspace:\/\/SpacesStore\/c0705dc5-e4ae-42fc-9de6-3eaaea5554c9",
      creator: {
         forename: "Carol",
         surname: "Cook",
         username: "ccook"
      },
      created: "2013-10-24T21:45:09.000Z",
      modifier: {
         forename: "Craig",
         surname: "Evans",
         username: "cevans"
      },
      modified: "2015-05-22T19:59:52.000Z"
   }, {
      title: "Mole Valley",
      nodeRef: "workspace:\/\/SpacesStore\/a70dbecb-e4de-479c-9a02-e74b7e796546",
      creator: {
         forename: "Marie",
         surname: "Gilbert",
         username: "mgilbert"
      },
      created: "2014-01-10T04:23:44.000Z",
      modifier: {
         forename: "Robin",
         surname: "Fox",
         username: "rfox"
      },
      modified: "2015-02-25T07:03:16.000Z"
   }, {
      title: "SHA level data tables",
      nodeRef: "workspace:\/\/SpacesStore\/88a85945-e8d9-49a3-b7ad-8bf5a91933c2",
      creator: {
         forename: "Harold",
         surname: "Gray",
         username: "hgray"
      },
      created: "2014-04-01T11:08:36.000Z",
      modifier: {
         forename: "Patricia",
         surname: "Mcdonald",
         username: "pmcdonald"
      },
      modified: "2014-10-11T12:18:14.000Z"
   }, {
      title: "Nurse Prescribers",
      nodeRef: "workspace:\/\/SpacesStore\/d880a04c-fd04-4faa-a56a-ce292935445c",
      creator: {
         forename: "Katherine",
         surname: "Davis",
         username: "kdavis"
      },
      created: "2014-07-01T03:21:20.000Z",
      modifier: {
         forename: "Teresa",
         surname: "Reyes",
         username: "treyes"
      },
      modified: "2015-04-20T15:52:35.000Z"
   }, {
      title: "Poole Premises Licences",
      nodeRef: "workspace:\/\/SpacesStore\/04b8a057-45d7-441c-86f2-65687a1e1a79",
      creator: {
         forename: "Lois",
         surname: "Diaz",
         username: "ldiaz"
      },
      created: "2014-07-03T19:17:47.000Z",
      modifier: {
         forename: "Roger",
         surname: "Hunt",
         username: "rhunt"
      },
      modified: "2015-01-27T06:11:11.000Z"
   }, {
      title: "City Connect cycle route",
      nodeRef: "workspace:\/\/SpacesStore\/30373f96-a4e4-48a4-b5b6-a6ac222b302d",
      creator: {
         forename: "Stephen",
         surname: "Simmons",
         username: "ssimmons"
      },
      created: "2013-11-25T07:35:45.000Z",
      modifier: {
         forename: "Ronald",
         surname: "Castillo",
         username: "rcastillo"
      },
      modified: "2015-01-23T14:48:20.000Z"
   }, {
      title: "Household Projections",
      nodeRef: "workspace:\/\/SpacesStore\/7fc99754-160a-45df-bc86-423059f235d8",
      creator: {
         forename: "Amy",
         surname: "Rice",
         username: "arice"
      },
      created: "2014-05-10T15:58:26.000Z",
      modifier: {
         forename: "Ruth",
         surname: "Alexander",
         username: "ralexander"
      },
      modified: "2014-12-11T12:14:45.000Z"
   }, {
      title: "Welsh Local Health Boards",
      nodeRef: "workspace:\/\/SpacesStore\/379d1270-ba2f-4c2a-b2c1-307bcbc29aab",
      creator: {
         forename: "Dennis",
         surname: "Cole",
         username: "dcole"
      },
      created: "2013-09-02T16:13:01.000Z",
      modifier: {
         forename: "Nicole",
         surname: "Flores",
         username: "nflores"
      },
      modified: "2014-11-30T06:27:59.000Z"
   }, {
      title: "Appointments by ethnicity",
      nodeRef: "workspace:\/\/SpacesStore\/a590b0b7-5796-430f-9cef-5d2b5c142218",
      creator: {
         forename: "Robert",
         surname: "Cruz",
         username: "rcruz"
      },
      created: "2014-05-12T09:56:09.000Z",
      modifier: {
         forename: "Justin",
         surname: "Black",
         username: "jblack"
      },
      modified: "2015-02-20T02:30:55.000Z"
   }, {
      title: "ASAP data definitions file",
      nodeRef: "workspace:\/\/SpacesStore\/1822876f-dc45-445f-830d-552d2fd79bb2",
      creator: {
         forename: "Frank",
         surname: "Schmidt",
         username: "fschmidt"
      },
      created: "2014-07-14T21:47:51.000Z",
      modifier: {
         forename: "George",
         surname: "Gilbert",
         username: "ggilbert"
      },
      modified: "2015-05-15T04:39:00.000Z"
   }, {
      title: "Prompt Payment Table",
      nodeRef: "workspace:\/\/SpacesStore\/d40e1a25-df32-4759-951d-dc0c4ce5537f",
      creator: {
         forename: "Cheryl",
         surname: "Ramos",
         username: "cramos"
      },
      created: "2014-03-22T17:13:14.000Z",
      modifier: {
         forename: "Lois",
         surname: "Montgomery",
         username: "lmontgomery"
      },
      modified: "2014-10-26T10:23:21.000Z"
   }, {
      title: "Delegates for training by sexual orientation",
      nodeRef: "workspace:\/\/SpacesStore\/e791086e-5de4-48c0-9baf-b40a5bcb3b81",
      creator: {
         forename: "Carlos",
         surname: "Meyer",
         username: "cmeyer"
      },
      created: "2014-03-22T09:35:22.000Z",
      modifier: {
         forename: "Mark",
         surname: "Crawford",
         username: "mcrawford"
      },
      modified: "2015-08-04T13:18:17.000Z"
   }, {
      title: "Adult Social Care Survey",
      nodeRef: "workspace:\/\/SpacesStore\/e81684af-6cf1-4bce-a545-7af9aa23626c",
      creator: {
         forename: "Harold",
         surname: "Graham",
         username: "hgraham"
      },
      created: "2014-07-12T23:53:26.000Z",
      modifier: {
         forename: "Anthony",
         surname: "Carroll",
         username: "acarroll"
      },
      modified: "2015-08-11T22:38:23.000Z"
   }, {
      title: "Premises licences CSV",
      nodeRef: "workspace:\/\/SpacesStore\/6af8216c-5f76-42b7-b114-269f4d056517",
      creator: {
         forename: "Robin",
         surname: "Fowler",
         username: "rfowler"
      },
      created: "2013-12-03T20:43:16.000Z",
      modifier: {
         forename: "Theresa",
         surname: "Gray",
         username: "tgray"
      },
      modified: "2015-08-02T15:22:01.000Z"
   }, {
      title: "Success Rates by Level",
      nodeRef: "workspace:\/\/SpacesStore\/624e4b4a-adfe-41b3-a360-b46dea9a82f4",
      creator: {
         forename: "Julie",
         surname: "Reid",
         username: "jreid"
      },
      created: "2013-10-07T08:18:58.000Z",
      modifier: {
         forename: "William",
         surname: "Cruz",
         username: "wcruz"
      },
      modified: "2015-06-24T05:01:58.000Z"
   }, {
      title: "West Yorkshire",
      nodeRef: "workspace:\/\/SpacesStore\/5021bffb-8640-4953-8a5f-4b64b390ffec",
      creator: {
         forename: "Gerald",
         surname: "Olson",
         username: "golson"
      },
      created: "2013-08-29T10:12:13.000Z",
      modifier: {
         forename: "Aaron",
         surname: "Stewart",
         username: "astewart"
      },
      modified: "2014-09-02T23:06:57.000Z"
   }, {
      title: "Historic Urban Districts",
      nodeRef: "workspace:\/\/SpacesStore\/1839991e-0be9-4239-9a51-60967f4c1ea1",
      creator: {
         forename: "Heather",
         surname: "Cooper",
         username: "hcooper"
      },
      created: "2014-07-07T16:10:06.000Z",
      modifier: {
         forename: "Wayne",
         surname: "Ruiz",
         username: "wruiz"
      },
      modified: "2014-09-25T23:35:10.000Z"
   }, {
      title: "ODA Multilateral Aid",
      nodeRef: "workspace:\/\/SpacesStore\/281b5a1c-68e2-4bc3-b3f3-1220abd1a0a2",
      creator: {
         forename: "James",
         surname: "Gray",
         username: "jgray"
      },
      created: "2014-03-07T15:30:37.000Z",
      modifier: {
         forename: "Jessica",
         surname: "Hamilton",
         username: "jhamilton"
      },
      modified: "2014-09-04T22:36:43.000Z"
   }, {
      title: "Spending tool landing page",
      nodeRef: "workspace:\/\/SpacesStore\/cbae7b77-73e9-4fef-acb0-06b1febb0fb5",
      creator: {
         forename: "Margaret",
         surname: "Oliver",
         username: "moliver"
      },
      created: "2014-01-01T08:51:07.000Z",
      modifier: {
         forename: "Ruby",
         surname: "Nichols",
         username: "rnichols"
      },
      modified: "2015-04-11T02:58:27.000Z"
   }, {
      title: "VoID Descriptions Turtle",
      nodeRef: "workspace:\/\/SpacesStore\/9f462485-d411-4d47-b901-2a4ffde26a0a",
      creator: {
         forename: "Adam",
         surname: "Wheeler",
         username: "awheeler"
      },
      created: "2013-12-21T23:43:17.000Z",
      modifier: {
         forename: "Janice",
         surname: "West",
         username: "jwest"
      },
      modified: "2015-07-24T14:19:49.000Z"
   }, {
      title: "FE and Skills Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/9cf74abc-b774-4b60-ad15-197fb406660f",
      creator: {
         forename: "Samuel",
         surname: "Henry",
         username: "shenry"
      },
      created: "2014-08-18T05:41:22.000Z",
      modifier: {
         forename: "Elizabeth",
         surname: "Kelley",
         username: "ekelley"
      },
      modified: "2014-10-25T00:36:42.000Z"
   }, {
      title: "Channels in Devon XML",
      nodeRef: "workspace:\/\/SpacesStore\/4140432e-f754-4fe7-8856-4deb6299fa2f",
      creator: {
         forename: "David",
         surname: "Garrett",
         username: "dgarrett"
      },
      created: "2014-06-21T16:31:11.000Z",
      modifier: {
         forename: "Jeremy",
         surname: "Henderson",
         username: "jhenderson"
      },
      modified: "2015-06-14T17:21:57.000Z"
   }, {
      title: "Deaths Intestate",
      nodeRef: "workspace:\/\/SpacesStore\/13e5fd8b-c0c9-4273-ac8e-23b0321ef9d5",
      creator: {
         forename: "Virginia",
         surname: "Murphy",
         username: "vmurphy"
      },
      created: "2014-06-19T20:32:51.000Z",
      modifier: {
         forename: "Teresa",
         surname: "Collins",
         username: "tcollins"
      },
      modified: "2015-06-16T12:34:31.000Z"
   }, {
      title: "CMR NI data",
      nodeRef: "workspace:\/\/SpacesStore\/0911eeca-baaa-42c6-a242-e0d6d09b22d4",
      creator: {
         forename: "Alan",
         surname: "Wallace",
         username: "awallace"
      },
      created: "2014-08-14T21:25:58.000Z",
      modifier: {
         forename: "Dorothy",
         surname: "Hernandez",
         username: "dhernandez"
      },
      modified: "2015-08-07T09:53:44.000Z"
   }, {
      title: "Culverts in Devon CSV",
      nodeRef: "workspace:\/\/SpacesStore\/bc2c5af2-3be8-47d4-8e00-1260fe0568f8",
      creator: {
         forename: "Wanda",
         surname: "Harvey",
         username: "wharvey"
      },
      created: "2013-10-05T02:01:04.000Z",
      modifier: {
         forename: "Donna",
         surname: "Richards",
         username: "drichards"
      },
      modified: "2014-10-26T12:10:07.000Z"
   }, {
      title: "Dundee City",
      nodeRef: "workspace:\/\/SpacesStore\/3c6f645e-9df5-44e3-81ae-a00c6974481d",
      creator: {
         forename: "Ruby",
         surname: "Mendoza",
         username: "rmendoza"
      },
      created: "2014-03-02T02:35:59.000Z",
      modifier: {
         forename: "James",
         surname: "Thompson",
         username: "jthompson"
      },
      modified: "2014-11-27T00:42:30.000Z"
   }, {
      title: "Structured Data",
      nodeRef: "workspace:\/\/SpacesStore\/66d4b494-7cac-437b-a5df-44df8f839686",
      creator: {
         forename: "Theresa",
         surname: "Vasquez",
         username: "tvasquez"
      },
      created: "2014-04-23T17:45:55.000Z",
      modifier: {
         forename: "Sandra",
         surname: "Richardson",
         username: "srichardson"
      },
      modified: "2015-01-14T17:50:05.000Z"
   }, {
      title: "Internal appointments by gender",
      nodeRef: "workspace:\/\/SpacesStore\/d4e38090-a978-416e-89b9-7cca392ed856",
      creator: {
         forename: "Arthur",
         surname: "Larson",
         username: "alarson"
      },
      created: "2013-09-23T07:09:09.000Z",
      modifier: {
         forename: "Linda",
         surname: "Mason",
         username: "lmason"
      },
      modified: "2015-03-16T21:36:56.000Z"
   }, {
      title: "East Devon Asset Dataset",
      nodeRef: "workspace:\/\/SpacesStore\/98551694-7853-45e6-8139-78b31addc6fd",
      creator: {
         forename: "Cheryl",
         surname: "Hall",
         username: "chall"
      },
      created: "2013-08-31T12:06:51.000Z",
      modifier: {
         forename: "Betty",
         surname: "Mason",
         username: "bmason"
      },
      modified: "2015-05-14T17:33:01.000Z"
   }, {
      title: "National Bowel Cancer Audit",
      nodeRef: "workspace:\/\/SpacesStore\/94a29dfc-4543-41ce-b19e-0eeb3eebc23d",
      creator: {
         forename: "Roy",
         surname: "Ortiz",
         username: "rortiz"
      },
      created: "2013-08-25T12:50:10.000Z",
      modifier: {
         forename: "Howard",
         surname: "Gilbert",
         username: "hgilbert"
      },
      modified: "2014-10-16T05:23:20.000Z"
   }, {
      title: "Council spending",
      nodeRef: "workspace:\/\/SpacesStore\/751dc19e-25d1-4503-9385-6d2ca02cac2f",
      creator: {
         forename: "Cynthia",
         surname: "Mills",
         username: "cmills"
      },
      created: "2014-01-08T05:26:51.000Z",
      modifier: {
         forename: "Christopher",
         surname: "Harvey",
         username: "charvey"
      },
      modified: "2014-08-26T15:29:41.000Z"
   }, {
      title: "Junior staff salaries",
      nodeRef: "workspace:\/\/SpacesStore\/83ef8856-deee-45f3-a013-9f74ef81d195",
      creator: {
         forename: "Howard",
         surname: "Harper",
         username: "hharper"
      },
      created: "2014-02-05T23:47:57.000Z",
      modifier: {
         forename: "Robin",
         surname: "Harris",
         username: "rharris"
      },
      modified: "2015-05-10T03:43:51.000Z"
   }, {
      title: "DataStore interface",
      nodeRef: "workspace:\/\/SpacesStore\/8d5dd884-041f-4fd4-83ef-56d051f4ddb1",
      creator: {
         forename: "Katherine",
         surname: "Franklin",
         username: "kfranklin"
      },
      created: "2014-08-13T10:55:06.000Z",
      modifier: {
         forename: "Wanda",
         surname: "Robinson",
         username: "wrobinson"
      },
      modified: "2014-08-24T07:03:57.000Z"
   }, {
      title: "DBS filtering guide",
      nodeRef: "workspace:\/\/SpacesStore\/6009d3c7-49ea-40a6-a0a5-56bd5d89037e",
      creator: {
         forename: "Judith",
         surname: "Gonzalez",
         username: "jgonzalez"
      },
      created: "2013-08-25T03:16:04.000Z",
      modifier: {
         forename: "Joe",
         surname: "Walker",
         username: "jwalker"
      },
      modified: "2015-05-02T01:31:11.000Z"
   }, {
      title: "Inspire WMS service",
      nodeRef: "workspace:\/\/SpacesStore\/47c99aed-d610-4901-b527-5f95637bcbd9",
      creator: {
         forename: "Kathleen",
         surname: "Sanchez",
         username: "ksanchez"
      },
      created: "2014-03-21T16:12:26.000Z",
      modifier: {
         forename: "Wanda",
         surname: "Richards",
         username: "wrichards"
      },
      modified: "2015-08-08T22:19:16.000Z"
   }, {
      title: "South Gloucestershire",
      nodeRef: "workspace:\/\/SpacesStore\/7661817b-b77f-4a87-9688-89b7053179c5",
      creator: {
         forename: "Justin",
         surname: "King",
         username: "jking"
      },
      created: "2014-03-17T11:56:11.000Z",
      modifier: {
         forename: "Phyllis",
         surname: "Moore",
         username: "pmoore"
      },
      modified: "2015-03-07T08:11:31.000Z"
   }, {
      title: "Premises Licences",
      nodeRef: "workspace:\/\/SpacesStore\/994f3a80-7a6c-4ad3-ad4b-d2645f4897b0",
      creator: {
         forename: "Billy",
         surname: "Vasquez",
         username: "bvasquez"
      },
      created: "2013-12-07T06:49:37.000Z",
      modifier: {
         forename: "Laura",
         surname: "Fields",
         username: "lfields"
      },
      modified: "2015-03-20T18:30:26.000Z"
   }, {
      title: "National Passenger Survey website",
      nodeRef: "workspace:\/\/SpacesStore\/a5d7ad07-4346-412a-b3cd-188a23694ddb",
      creator: {
         forename: "John",
         surname: "Johnson",
         username: "jjohnson"
      },
      created: "2014-06-21T17:07:37.000Z",
      modifier: {
         forename: "Louise",
         surname: "Meyer",
         username: "lmeyer"
      },
      modified: "2015-06-13T11:58:37.000Z"
   }, {
      title: "Invoice payment information",
      nodeRef: "workspace:\/\/SpacesStore\/c08bab81-e67c-43f9-a19d-494fb0f65eae",
      creator: {
         forename: "Johnny",
         surname: "Thompson",
         username: "jthompson"
      },
      created: "2014-07-04T18:58:34.000Z",
      modifier: {
         forename: "Laura",
         surname: "Roberts",
         username: "lroberts"
      },
      modified: "2014-08-22T10:26:21.000Z"
   }, {
      title: "Additional information",
      nodeRef: "workspace:\/\/SpacesStore\/5493fe14-d516-46bd-8923-eaae22257bba",
      creator: {
         forename: "Albert",
         surname: "Rodriguez",
         username: "arodriguez"
      },
      created: "2013-09-24T16:54:03.000Z",
      modifier: {
         forename: "Sharon",
         surname: "White",
         username: "swhite"
      },
      modified: "2014-09-23T22:56:01.000Z"
   }, {
      title: "North Hertfordshire",
      nodeRef: "workspace:\/\/SpacesStore\/051a32c1-26da-4186-a09a-a72eb198e72c",
      creator: {
         forename: "Susan",
         surname: "Gonzalez",
         username: "sgonzalez"
      },
      created: "2013-09-30T20:11:28.000Z",
      modifier: {
         forename: "Betty",
         surname: "Taylor",
         username: "btaylor"
      },
      modified: "2015-04-12T14:29:18.000Z"
   }, {
      title: "HSCIC dementia information",
      nodeRef: "workspace:\/\/SpacesStore\/34d56c23-530f-4e70-9951-cf478dee26ec",
      creator: {
         forename: "Kathy",
         surname: "Spencer",
         username: "kspencer"
      },
      created: "2013-12-02T12:56:55.000Z",
      modifier: {
         forename: "Ernest",
         surname: "Bryant",
         username: "ebryant"
      },
      modified: "2014-10-28T00:46:30.000Z"
   }, {
      title: "Local sites web page",
      nodeRef: "workspace:\/\/SpacesStore\/28a28ef5-456c-48cf-8232-126f73f6ae22",
      creator: {
         forename: "Kelly",
         surname: "Payne",
         username: "kpayne"
      },
      created: "2013-10-29T14:27:26.000Z",
      modifier: {
         forename: "Christine",
         surname: "Fields",
         username: "cfields"
      },
      modified: "2014-11-06T20:40:48.000Z"
   }, {
      title: "Important Hedges",
      nodeRef: "workspace:\/\/SpacesStore\/73acd857-cc3e-48e5-927f-fd4562bbc471",
      creator: {
         forename: "Michael",
         surname: "Cruz",
         username: "mcruz"
      },
      created: "2013-12-26T22:41:36.000Z",
      modifier: {
         forename: "Phyllis",
         surname: "Porter",
         username: "pporter"
      },
      modified: "2015-01-11T12:19:47.000Z"
   }, {
      title: "Download instructions",
      nodeRef: "workspace:\/\/SpacesStore\/01602514-c8f7-4a0b-ab67-a1202d09f136",
      creator: {
         forename: "Timothy",
         surname: "Richardson",
         username: "trichardson"
      },
      created: "2014-06-06T05:30:39.000Z",
      modifier: {
         forename: "Deborah",
         surname: "Smith",
         username: "dsmith"
      },
      modified: "2015-06-03T23:45:42.000Z"
   }, {
      title: "Contract Finder",
      nodeRef: "workspace:\/\/SpacesStore\/5f930180-14b8-4c71-a6c5-376351946e1d",
      creator: {
         forename: "Diane",
         surname: "Gomez",
         username: "dgomez"
      },
      created: "2014-01-07T04:39:28.000Z",
      modifier: {
         forename: "Ashley",
         surname: "Hunt",
         username: "ahunt"
      },
      modified: "2014-11-03T19:18:50.000Z"
   }, {
      title: "Workforce data",
      nodeRef: "workspace:\/\/SpacesStore\/618ea706-8505-42c4-9626-14e130988759",
      creator: {
         forename: "Nicholas",
         surname: "Carter",
         username: "ncarter"
      },
      created: "2014-06-27T04:03:04.000Z",
      modifier: {
         forename: "Judith",
         surname: "Lane",
         username: "jlane"
      },
      modified: "2015-06-23T21:43:16.000Z"
   }, {
      title: "SLDC Constitution",
      nodeRef: "workspace:\/\/SpacesStore\/697ef3d0-4646-44eb-994c-3dcd8e573047",
      creator: {
         forename: "Juan",
         surname: "Elliott",
         username: "jelliott"
      },
      created: "2014-03-30T05:29:10.000Z",
      modifier: {
         forename: "Martin",
         surname: "Alexander",
         username: "malexander"
      },
      modified: "2015-04-15T06:03:13.000Z"
   }, {
      title: "Tree Preservations Orders",
      nodeRef: "workspace:\/\/SpacesStore\/6f2e0af3-9726-4207-864f-854fd6d7afc9",
      creator: {
         forename: "Antonio",
         surname: "Kennedy",
         username: "akennedy"
      },
      created: "2014-04-18T10:03:00.000Z",
      modifier: {
         forename: "Amy",
         surname: "Day",
         username: "aday"
      },
      modified: "2015-03-29T10:33:57.000Z"
   }, {
      title: "Bids to empty council houses",
      nodeRef: "workspace:\/\/SpacesStore\/a15048b8-171d-4e12-b4c4-ff66c9fa3eb6",
      creator: {
         forename: "Scott",
         surname: "Castillo",
         username: "scastillo"
      },
      created: "2014-08-09T19:53:50.000Z",
      modifier: {
         forename: "Terry",
         surname: "Butler",
         username: "tbutler"
      },
      modified: "2015-06-12T08:07:32.000Z"
   }, {
      title: "Council Information on designation",
      nodeRef: "workspace:\/\/SpacesStore\/79cf07e9-d508-49c1-a9ae-07178102d778",
      creator: {
         forename: "Rebecca",
         surname: "Taylor",
         username: "rtaylor"
      },
      created: "2014-05-13T21:06:30.000Z",
      modifier: {
         forename: "Mildred",
         surname: "Bell",
         username: "mbell"
      },
      modified: "2015-02-25T20:01:48.000Z"
   }, {
      title: "Press release",
      nodeRef: "workspace:\/\/SpacesStore\/47cb6319-7aa2-489b-a1b0-c64ea85a616c",
      creator: {
         forename: "Wanda",
         surname: "Dunn",
         username: "wdunn"
      },
      created: "2013-08-26T00:13:27.000Z",
      modifier: {
         forename: "Antonio",
         surname: "Fields",
         username: "afields"
      },
      modified: "2015-06-11T18:53:03.000Z"
   }, {
      title: "Gambling permits",
      nodeRef: "workspace:\/\/SpacesStore\/456217c6-7c08-4b99-b5f7-fe7ac86a0ad9",
      creator: {
         forename: "Marilyn",
         surname: "Johnston",
         username: "mjohnston"
      },
      created: "2014-08-06T11:37:23.000Z",
      modifier: {
         forename: "Jeremy",
         surname: "Carroll",
         username: "jcarroll"
      },
      modified: "2014-09-10T09:49:49.000Z"
   }, {
      title: "Abeyance and Dispersal GP",
      nodeRef: "workspace:\/\/SpacesStore\/feb0ea7b-89ab-42ff-a422-987ff29db140",
      creator: {
         forename: "Jack",
         surname: "Garrett",
         username: "jgarrett"
      },
      created: "2014-04-17T09:36:23.000Z",
      modifier: {
         forename: "Jessica",
         surname: "Turner",
         username: "jturner"
      },
      modified: "2015-02-23T16:51:37.000Z"
   }, {
      title: "Knife crime data",
      nodeRef: "workspace:\/\/SpacesStore\/3b6cfb05-bd87-4a85-b69b-ca17b5922a1c",
      creator: {
         forename: "Louis",
         surname: "Rose",
         username: "lrose"
      },
      created: "2014-01-23T11:07:21.000Z",
      modifier: {
         forename: "Diana",
         surname: "Graham",
         username: "dgraham"
      },
      modified: "2015-02-17T07:24:15.000Z"
   }, {
      title: "Blaby Election Information",
      nodeRef: "workspace:\/\/SpacesStore\/6799d5bf-5454-4c60-adce-25530bd2f08f",
      creator: {
         forename: "Deborah",
         surname: "Morris",
         username: "dmorris"
      },
      created: "2014-02-10T20:21:22.000Z",
      modifier: {
         forename: "Thomas",
         surname: "Marshall",
         username: "tmarshall"
      },
      modified: "2015-03-24T19:40:35.000Z"
   }, {
      title: "Planning Applications metadata",
      nodeRef: "workspace:\/\/SpacesStore\/e7148020-0c30-43bd-9f0e-2604abe5a684",
      creator: {
         forename: "Julie",
         surname: "Rogers",
         username: "jrogers"
      },
      created: "2013-12-24T15:15:13.000Z",
      modifier: {
         forename: "Anthony",
         surname: "Robertson",
         username: "arobertson"
      },
      modified: "2015-04-29T03:20:46.000Z"
   }, {
      title: "Premise Licenses",
      nodeRef: "workspace:\/\/SpacesStore\/59349c03-c9e3-4547-b85b-e2bb34ea526a",
      creator: {
         forename: "Jeremy",
         surname: "Oliver",
         username: "joliver"
      },
      created: "2014-07-27T07:36:34.000Z",
      modifier: {
         forename: "Heather",
         surname: "Martin",
         username: "hmartin"
      },
      modified: "2015-01-21T20:46:59.000Z"
   }, {
      title: "Archived GPs",
      nodeRef: "workspace:\/\/SpacesStore\/8f36933a-c433-455f-b7d6-cf265590e26e",
      creator: {
         forename: "Frank",
         surname: "Howell",
         username: "fhowell"
      },
      created: "2013-11-28T20:40:47.000Z",
      modifier: {
         forename: "Ryan",
         surname: "Miller",
         username: "rmiller"
      },
      modified: "2014-09-10T17:17:50.000Z"
   }, {
      title: "Other Quarterly Planning Decisions",
      nodeRef: "workspace:\/\/SpacesStore\/0fb87d98-3b52-4aae-bf58-0fd74cb3548a",
      creator: {
         forename: "Ann",
         surname: "Jacobs",
         username: "ajacobs"
      },
      created: "2014-07-23T09:51:58.000Z",
      modifier: {
         forename: "Irene",
         surname: "Martinez",
         username: "imartinez"
      },
      modified: "2015-05-29T09:41:47.000Z"
   }, {
      title: "Number of applications in England and Wales divided by region",
      nodeRef: "workspace:\/\/SpacesStore\/c3e7ce0d-eb7e-4c42-8501-51c97cbddcd7",
      creator: {
         forename: "Janice",
         surname: "Hart",
         username: "jhart"
      },
      created: "2014-04-19T22:41:09.000Z",
      modifier: {
         forename: "Dennis",
         surname: "Cook",
         username: "dcook"
      },
      modified: "2015-04-23T18:03:57.000Z"
   }, {
      title: "Schema guidance",
      nodeRef: "workspace:\/\/SpacesStore\/4df8ba8e-52e6-43b2-884c-ea1ce7d50eeb",
      creator: {
         forename: "Raymond",
         surname: "Carroll",
         username: "rcarroll"
      },
      created: "2013-09-27T10:13:58.000Z",
      modifier: {
         forename: "Tammy",
         surname: "Fernandez",
         username: "tfernandez"
      },
      modified: "2015-06-13T18:14:12.000Z"
   }, {
      title: "Newry and Mourne",
      nodeRef: "workspace:\/\/SpacesStore\/b1b9d106-8075-43f7-80de-c3528f60179b",
      creator: {
         forename: "Jerry",
         surname: "Watkins",
         username: "jwatkins"
      },
      created: "2014-02-15T05:03:55.000Z",
      modifier: {
         forename: "Pamela",
         surname: "Wright",
         username: "pwright"
      },
      modified: "2015-03-30T19:17:12.000Z"
   }, {
      title: "Data file",
      nodeRef: "workspace:\/\/SpacesStore\/9e03106a-898a-4540-9f79-2ec03829d561",
      creator: {
         forename: "Scott",
         surname: "Williamson",
         username: "swilliamson"
      },
      created: "2014-07-26T21:04:28.000Z",
      modifier: {
         forename: "Jacqueline",
         surname: "Lawrence",
         username: "jlawrence"
      },
      modified: "2015-08-14T01:46:25.000Z"
   }, {
      title: "SHMI Support and Guidance",
      nodeRef: "workspace:\/\/SpacesStore\/524a64dc-ae7b-4695-a56f-a63c954814b4",
      creator: {
         forename: "Amanda",
         surname: "Thompson",
         username: "athompson"
      },
      created: "2014-04-18T14:59:34.000Z",
      modifier: {
         forename: "Mark",
         surname: "Brooks",
         username: "mbrooks"
      },
      modified: "2014-10-21T18:35:49.000Z"
   }, {
      title: "Customer service performance",
      nodeRef: "workspace:\/\/SpacesStore\/5d29d6ec-e139-4eec-9b05-3b5eb92381f6",
      creator: {
         forename: "Robin",
         surname: "Williamson",
         username: "rwilliamson"
      },
      created: "2014-07-10T09:39:01.000Z",
      modifier: {
         forename: "Norma",
         surname: "Hughes",
         username: "nhughes"
      },
      modified: "2015-04-01T05:21:33.000Z"
   }, {
      title: "Statistics on Drug Misuse",
      nodeRef: "workspace:\/\/SpacesStore\/fc6f81ec-b8b0-4abc-a82a-f3f6d893566c",
      creator: {
         forename: "Judith",
         surname: "Martin",
         username: "jmartin"
      },
      created: "2014-05-31T23:42:25.000Z",
      modifier: {
         forename: "Clarence",
         surname: "Mcdonald",
         username: "cmcdonald"
      },
      modified: "2015-05-28T02:17:28.000Z"
   }, {
      title: "South Buckinghamshire",
      nodeRef: "workspace:\/\/SpacesStore\/fa80c223-ccaf-4776-b8fa-2caf81ba2bcd",
      creator: {
         forename: "Maria",
         surname: "Garcia",
         username: "mgarcia"
      },
      created: "2013-09-02T11:26:04.000Z",
      modifier: {
         forename: "Michelle",
         surname: "Gomez",
         username: "mgomez"
      },
      modified: "2015-01-31T07:29:33.000Z"
   }, {
      title: "GP Practice Vacancies",
      nodeRef: "workspace:\/\/SpacesStore\/5471e5d5-c565-4c17-a5d9-1a271fbf48fd",
      creator: {
         forename: "Debra",
         surname: "Rogers",
         username: "drogers"
      },
      created: "2014-01-04T11:56:13.000Z",
      modifier: {
         forename: "George",
         surname: "Thomas",
         username: "gthomas"
      },
      modified: "2014-11-24T23:47:00.000Z"
   }, {
      title: "Smoke Control Area",
      nodeRef: "workspace:\/\/SpacesStore\/fae430b4-124b-4cee-b475-49853c8e22c5",
      creator: {
         forename: "Frank",
         surname: "Moreno",
         username: "fmoreno"
      },
      created: "2014-02-15T06:26:18.000Z",
      modifier: {
         forename: "Teresa",
         surname: "Morrison",
         username: "tmorrison"
      },
      modified: "2014-09-21T13:08:14.000Z"
   }, {
      title: "East Riding of Yorkshire",
      nodeRef: "workspace:\/\/SpacesStore\/1759b1c4-145e-4d14-9ac8-4b003a63e511",
      creator: {
         forename: "Lawrence",
         surname: "Nichols",
         username: "lnichols"
      },
      created: "2014-04-16T17:01:25.000Z",
      modifier: {
         forename: "Laura",
         surname: "Lopez",
         username: "llopez"
      },
      modified: "2014-10-03T14:18:53.000Z"
   }, {
      title: "Data coding information",
      nodeRef: "workspace:\/\/SpacesStore\/7f07285e-9c96-4dbc-89ff-9e03219bac12",
      creator: {
         forename: "Marilyn",
         surname: "Montgomery",
         username: "mmontgomery"
      },
      created: "2014-02-05T23:53:04.000Z",
      modifier: {
         forename: "David",
         surname: "Peters",
         username: "dpeters"
      },
      modified: "2014-10-07T04:47:21.000Z"
   }, {
      title: "UKCESS Wales Local Data Toolkit",
      nodeRef: "workspace:\/\/SpacesStore\/99c95ce2-093b-4e38-b84e-b2dce588a77c",
      creator: {
         forename: "Cynthia",
         surname: "Allen",
         username: "callen"
      },
      created: "2014-04-19T18:22:26.000Z",
      modifier: {
         forename: "Louise",
         surname: "Hamilton",
         username: "lhamilton"
      },
      modified: "2015-05-28T22:53:12.000Z"
   }, {
      title: "Business rates web page",
      nodeRef: "workspace:\/\/SpacesStore\/ed8b0f51-6cb1-41be-a6f6-decdfcf10749",
      creator: {
         forename: "Jose",
         surname: "Hart",
         username: "jhart"
      },
      created: "2014-04-09T00:15:47.000Z",
      modifier: {
         forename: "Carolyn",
         surname: "Graham",
         username: "cgraham"
      },
      modified: "2014-12-28T19:21:44.000Z"
   }, {
      title: "LGA Transparency Guidance",
      nodeRef: "workspace:\/\/SpacesStore\/e2cd05e9-5345-476c-9811-df574ff58902",
      creator: {
         forename: "Maria",
         surname: "Elliott",
         username: "melliott"
      },
      created: "2013-09-19T08:59:49.000Z",
      modifier: {
         forename: "Beverly",
         surname: "Tucker",
         username: "btucker"
      },
      modified: "2015-03-21T05:27:38.000Z"
   }, {
      title: "Degree of improvement in door to balloon time delays by performance",
      nodeRef: "workspace:\/\/SpacesStore\/9443ff35-3dcd-461e-8526-505e2922ff45",
      creator: {
         forename: "Margaret",
         surname: "Gomez",
         username: "mgomez"
      },
      created: "2014-05-30T16:55:12.000Z",
      modifier: {
         forename: "Theresa",
         surname: "Warren",
         username: "twarren"
      },
      modified: "2015-05-03T16:56:10.000Z"
   }, {
      title: "HMOs Section G",
      nodeRef: "workspace:\/\/SpacesStore\/ccfc1714-15d8-4798-bc64-a06c348b0f31",
      creator: {
         forename: "Billy",
         surname: "Cunningham",
         username: "bcunningham"
      },
      created: "2013-12-08T09:36:59.000Z",
      modifier: {
         forename: "Janet",
         surname: "Harvey",
         username: "jharvey"
      },
      modified: "2015-03-13T11:15:46.000Z"
   }, {
      title: "North Dorset",
      nodeRef: "workspace:\/\/SpacesStore\/eff2e752-8b68-4acf-9f0c-2db49028916d",
      creator: {
         forename: "Fred",
         surname: "Lynch",
         username: "flynch"
      },
      created: "2014-05-20T20:47:57.000Z",
      modifier: {
         forename: "Maria",
         surname: "Ross",
         username: "mross"
      },
      modified: "2015-04-02T21:26:26.000Z"
   }, {
      title: "HQIP website",
      nodeRef: "workspace:\/\/SpacesStore\/d9f0755c-1adf-4511-bceb-9d9b32fb1f3e",
      creator: {
         forename: "Ralph",
         surname: "Carpenter",
         username: "rcarpenter"
      },
      created: "2014-03-05T05:52:14.000Z",
      modifier: {
         forename: "Donna",
         surname: "Washington",
         username: "dwashington"
      },
      modified: "2015-01-22T04:20:18.000Z"
   }, {
      title: "Hospitality and Gift register",
      nodeRef: "workspace:\/\/SpacesStore\/23b80b7c-e909-463b-8aae-c63dc3ef07fe",
      creator: {
         forename: "Sara",
         surname: "Crawford",
         username: "scrawford"
      },
      created: "2013-11-05T03:06:58.000Z",
      modifier: {
         forename: "Joan",
         surname: "Williams",
         username: "jwilliams"
      },
      modified: "2015-07-27T00:38:24.000Z"
   }, {
      title: "Public health funeral data",
      nodeRef: "workspace:\/\/SpacesStore\/26325311-8656-4c5a-b1b3-190999375c8d",
      creator: {
         forename: "Paula",
         surname: "Robertson",
         username: "probertson"
      },
      created: "2014-07-09T15:40:40.000Z",
      modifier: {
         forename: "Scott",
         surname: "Turner",
         username: "sturner"
      },
      modified: "2014-09-27T19:26:12.000Z"
   }, {
      title: "OGC Compliant WMS Service",
      nodeRef: "workspace:\/\/SpacesStore\/740cc6c6-e966-45e2-bc8e-4a287598e913",
      creator: {
         forename: "Howard",
         surname: "Kennedy",
         username: "hkennedy"
      },
      created: "2013-12-08T09:24:17.000Z",
      modifier: {
         forename: "Russell",
         surname: "Ellis",
         username: "rellis"
      },
      modified: "2014-10-26T11:39:46.000Z"
   }, {
      title: "Nottingham City",
      nodeRef: "workspace:\/\/SpacesStore\/b671c533-ff00-44d2-afde-9a7078288d7b",
      creator: {
         forename: "Rachel",
         surname: "Pierce",
         username: "rpierce"
      },
      created: "2014-07-02T04:27:23.000Z",
      modifier: {
         forename: "Phillip",
         surname: "Stone",
         username: "pstone"
      },
      modified: "2015-02-18T04:31:10.000Z"
   }, {
      title: "Text data tables",
      nodeRef: "workspace:\/\/SpacesStore\/7af868d9-d16c-4a0c-abe1-0ed2d9560c4c",
      creator: {
         forename: "Craig",
         surname: "Daniels",
         username: "cdaniels"
      },
      created: "2013-09-28T09:33:19.000Z",
      modifier: {
         forename: "Deborah",
         surname: "Jacobs",
         username: "djacobs"
      },
      modified: "2014-11-22T10:10:50.000Z"
   }, {
      title: "Section E",
      nodeRef: "workspace:\/\/SpacesStore\/98ea8a72-4aab-481f-ba4d-da69136ad1de",
      creator: {
         forename: "Justin",
         surname: "Romero",
         username: "jromero"
      },
      created: "2013-11-21T00:15:36.000Z",
      modifier: {
         forename: "Timothy",
         surname: "Hart",
         username: "thart"
      },
      modified: "2014-11-09T21:19:09.000Z"
   }, {
      title: "Payments to Suppliers",
      nodeRef: "workspace:\/\/SpacesStore\/440b51ba-e8a1-4a15-97c2-e6c11ad013a5",
      creator: {
         forename: "Dorothy",
         surname: "West",
         username: "dwest"
      },
      created: "2013-11-11T21:45:36.000Z",
      modifier: {
         forename: "Irene",
         surname: "Hill",
         username: "ihill"
      },
      modified: "2014-11-09T18:54:25.000Z"
   }, {
      title: "Dwelling Stock",
      nodeRef: "workspace:\/\/SpacesStore\/5f709828-892a-44a3-9401-147c91fe53f5",
      creator: {
         forename: "Lori",
         surname: "Torres",
         username: "ltorres"
      },
      created: "2013-11-27T14:42:29.000Z",
      modifier: {
         forename: "Marilyn",
         surname: "Diaz",
         username: "mdiaz"
      },
      modified: "2015-05-28T07:16:30.000Z"
   }, {
      title: "Senior Staff",
      nodeRef: "workspace:\/\/SpacesStore\/b5e6e3f4-64c2-403e-96f2-281297fa6728",
      creator: {
         forename: "James",
         surname: "Franklin",
         username: "jfranklin"
      },
      created: "2014-01-30T02:31:55.000Z",
      modifier: {
         forename: "William",
         surname: "Bailey",
         username: "wbailey"
      },
      modified: "2014-08-30T18:02:00.000Z"
   }, {
      title: "Junior staff salary data",
      nodeRef: "workspace:\/\/SpacesStore\/622ca646-805b-4b55-b79c-859accebc397",
      creator: {
         forename: "Ann",
         surname: "Andrews",
         username: "aandrews"
      },
      created: "2013-11-04T09:14:19.000Z",
      modifier: {
         forename: "Kevin",
         surname: "Wells",
         username: "kwells"
      },
      modified: "2015-01-13T12:18:41.000Z"
   }, {
      title: "Local Plan Information",
      nodeRef: "workspace:\/\/SpacesStore\/9d5eaa1e-2813-4458-a10c-3f739c4502c2",
      creator: {
         forename: "Lori",
         surname: "Rose",
         username: "lrose"
      },
      created: "2013-09-30T14:59:43.000Z",
      modifier: {
         forename: "Kevin",
         surname: "Bishop",
         username: "kbishop"
      },
      modified: "2015-03-06T07:56:50.000Z"
   }, {
      title: "Boundaries in KML format",
      nodeRef: "workspace:\/\/SpacesStore\/baf77562-a6ce-4919-a0f2-2ffd6da3d818",
      creator: {
         forename: "Albert",
         surname: "Murray",
         username: "amurray"
      },
      created: "2014-02-15T23:38:51.000Z",
      modifier: {
         forename: "Norma",
         surname: "Bell",
         username: "nbell"
      },
      modified: "2015-02-11T13:40:28.000Z"
   }, {
      title: "HSCIC Lifestyles",
      nodeRef: "workspace:\/\/SpacesStore\/c6b1108d-3b57-4537-8a13-df063ee39c92",
      creator: {
         forename: "Virginia",
         surname: "Williams",
         username: "vwilliams"
      },
      created: "2014-04-06T09:07:55.000Z",
      modifier: {
         forename: "Eugene",
         surname: "Harper",
         username: "eharper"
      },
      modified: "2014-10-10T18:09:25.000Z"
   }, {
      title: "Planning Applications",
      nodeRef: "workspace:\/\/SpacesStore\/115f976d-e451-4ba1-953a-570dd27f74e1",
      creator: {
         forename: "Kathy",
         surname: "Wagner",
         username: "kwagner"
      },
      created: "2014-04-09T01:19:52.000Z",
      modifier: {
         forename: "Denise",
         surname: "Jordan",
         username: "djordan"
      },
      modified: "2015-01-15T12:10:55.000Z"
   }, {
      title: "New Forest",
      nodeRef: "workspace:\/\/SpacesStore\/39a8f468-1a25-4355-95c4-9ff2ca87b93b",
      creator: {
         forename: "Donna",
         surname: "Wright",
         username: "dwright"
      },
      created: "2014-01-18T12:22:03.000Z",
      modifier: {
         forename: "Roger",
         surname: "Marshall",
         username: "rmarshall"
      },
      modified: "2014-11-17T23:00:33.000Z"
   }, {
      title: "Clinical domain data tables",
      nodeRef: "workspace:\/\/SpacesStore\/2a674db5-de3d-46a5-86c4-ea44dcab8967",
      creator: {
         forename: "Gloria",
         surname: "Peterson",
         username: "gpeterson"
      },
      created: "2014-01-04T03:33:33.000Z",
      modifier: {
         forename: "Matthew",
         surname: "Kim",
         username: "mkim"
      },
      modified: "2014-10-26T18:27:59.000Z"
   }, {
      title: "Organisation Chart",
      nodeRef: "workspace:\/\/SpacesStore\/a0c5b3cd-c2b6-444b-ade5-d8feb408046a",
      creator: {
         forename: "Mildred",
         surname: "Knight",
         username: "mknight"
      },
      created: "2014-05-20T11:27:13.000Z",
      modifier: {
         forename: "Eric",
         surname: "Hansen",
         username: "ehansen"
      },
      modified: "2015-01-25T10:52:09.000Z"
   }, {
      title: "Frequently asked questions",
      nodeRef: "workspace:\/\/SpacesStore\/d19df1d8-0614-435c-b50a-b975027cc09b",
      creator: {
         forename: "Deborah",
         surname: "Snyder",
         username: "dsnyder"
      },
      created: "2013-09-06T03:28:52.000Z",
      modifier: {
         forename: "Andrea",
         surname: "Wells",
         username: "awells"
      },
      modified: "2014-11-22T07:00:44.000Z"
   }, {
      title: "Contingent liabilities",
      nodeRef: "workspace:\/\/SpacesStore\/0a9cf82e-50dc-47b1-92d8-a476cae83d54",
      creator: {
         forename: "Randy",
         surname: "Arnold",
         username: "rarnold"
      },
      created: "2013-12-12T15:08:03.000Z",
      modifier: {
         forename: "Aaron",
         surname: "Hawkins",
         username: "ahawkins"
      },
      modified: "2014-09-16T05:15:55.000Z"
   }, {
      title: "Regional Benefit Expenditure",
      nodeRef: "workspace:\/\/SpacesStore\/f2aef7a9-433b-4672-ba27-b25e4f4a0051",
      creator: {
         forename: "Kelly",
         surname: "Simpson",
         username: "ksimpson"
      },
      created: "2014-02-19T16:27:20.000Z",
      modifier: {
         forename: "Rose",
         surname: "Hicks",
         username: "rhicks"
      },
      modified: "2014-10-07T23:10:25.000Z"
   }, {
      title: "Bulletin tables",
      nodeRef: "workspace:\/\/SpacesStore\/1e574140-14b0-421c-a37a-d27a9d0f4158",
      creator: {
         forename: "Tina",
         surname: "Simmons",
         username: "tsimmons"
      },
      created: "2013-11-04T06:49:07.000Z",
      modifier: {
         forename: "Ann",
         surname: "Boyd",
         username: "aboyd"
      },
      modified: "2014-09-26T18:19:19.000Z"
   }, {
      title: "IAPT Data Quality Report",
      nodeRef: "workspace:\/\/SpacesStore\/ed2069de-d2d1-4d23-9de2-08b772843504",
      creator: {
         forename: "Michael",
         surname: "Gonzalez",
         username: "mgonzalez"
      },
      created: "2014-06-25T17:09:31.000Z",
      modifier: {
         forename: "Ashley",
         surname: "Ruiz",
         username: "aruiz"
      },
      modified: "2014-11-29T11:57:41.000Z"
   }, {
      title: "Public Toilets in Manchester",
      nodeRef: "workspace:\/\/SpacesStore\/bb88c531-a857-4dd0-9d08-e2247ccf8140",
      creator: {
         forename: "Marilyn",
         surname: "Jacobs",
         username: "mjacobs"
      },
      created: "2014-01-30T14:33:00.000Z",
      modifier: {
         forename: "Juan",
         surname: "Peterson",
         username: "jpeterson"
      },
      modified: "2015-01-11T06:05:33.000Z"
   }, {
      title: "Burglary",
      nodeRef: "workspace:\/\/SpacesStore\/fb5501bb-28c5-469d-95f5-7a4d8260416c",
      creator: {
         forename: "Henry",
         surname: "Chapman",
         username: "hchapman"
      },
      created: "2014-08-03T17:23:26.000Z",
      modifier: {
         forename: "Robin",
         surname: "Medina",
         username: "rmedina"
      },
      modified: "2014-09-21T01:28:31.000Z"
   }, {
      title: "Information asset register",
      nodeRef: "workspace:\/\/SpacesStore\/09bafd3c-18c6-496d-bdc1-52b0bf71c1dc",
      creator: {
         forename: "Teresa",
         surname: "Greene",
         username: "tgreene"
      },
      created: "2014-01-24T13:50:19.000Z",
      modifier: {
         forename: "Kelly",
         surname: "Hanson",
         username: "khanson"
      },
      modified: "2015-05-27T21:51:31.000Z"
   }, {
      title: "Outdoor sports faciltiies",
      nodeRef: "workspace:\/\/SpacesStore\/ba11ee94-dcee-42b3-a6f6-ff558395ad83",
      creator: {
         forename: "Bobby",
         surname: "Rose",
         username: "brose"
      },
      created: "2013-10-22T15:01:16.000Z",
      modifier: {
         forename: "Phillip",
         surname: "Reed",
         username: "preed"
      },
      modified: "2014-10-18T00:18:58.000Z"
   }, {
      title: "Children trend tables",
      nodeRef: "workspace:\/\/SpacesStore\/3d95363b-9aa2-46e9-b587-e1ceb7fd2682",
      creator: {
         forename: "Ryan",
         surname: "Thompson",
         username: "rthompson"
      },
      created: "2014-04-19T03:53:36.000Z",
      modifier: {
         forename: "Denise",
         surname: "Bell",
         username: "dbell"
      },
      modified: "2015-05-17T23:00:59.000Z"
   }, {
      title: "DfE website",
      nodeRef: "workspace:\/\/SpacesStore\/fc228910-b57e-48eb-8d51-23aedcf06512",
      creator: {
         forename: "Beverly",
         surname: "Palmer",
         username: "bpalmer"
      },
      created: "2014-07-24T01:19:56.000Z",
      modifier: {
         forename: "Brian",
         surname: "Smith",
         username: "bsmith"
      },
      modified: "2015-05-20T06:29:39.000Z"
   }, {
      title: "Remuneration report",
      nodeRef: "workspace:\/\/SpacesStore\/89508b06-149e-4016-8e40-dc977f064414",
      creator: {
         forename: "Catherine",
         surname: "Edwards",
         username: "cedwards"
      },
      created: "2014-01-05T01:31:20.000Z",
      modifier: {
         forename: "Stephanie",
         surname: "Campbell",
         username: "scampbell"
      },
      modified: "2014-10-26T14:47:52.000Z"
   }, {
      title: "Gender Percentiles",
      nodeRef: "workspace:\/\/SpacesStore\/10a72baf-6f3e-4f6b-9bb9-3188deb7870e",
      creator: {
         forename: "Clarence",
         surname: "Turner",
         username: "cturner"
      },
      created: "2014-06-16T12:01:24.000Z",
      modifier: {
         forename: "Harry",
         surname: "Black",
         username: "hblack"
      },
      modified: "2015-02-24T11:14:20.000Z"
   }, {
      title: "Defence Estates",
      nodeRef: "workspace:\/\/SpacesStore\/a65d3240-6dbd-418e-8bba-ff1643c86bce",
      creator: {
         forename: "Roy",
         surname: "Hernandez",
         username: "rhernandez"
      },
      created: "2014-01-17T14:37:32.000Z",
      modifier: {
         forename: "Brenda",
         surname: "Hayes",
         username: "bhayes"
      },
      modified: "2015-06-27T14:34:08.000Z"
   }, {
      title: "Canmore Web Map Service",
      nodeRef: "workspace:\/\/SpacesStore\/6896ada4-7f0f-4474-ac69-2755de3df6cb",
      creator: {
         forename: "Jane",
         surname: "Jordan",
         username: "jjordan"
      },
      created: "2013-12-16T07:24:27.000Z",
      modifier: {
         forename: "Lillian",
         surname: "Willis",
         username: "lwillis"
      },
      modified: "2015-08-01T11:58:15.000Z"
   }, {
      title: "PCT level data tables",
      nodeRef: "workspace:\/\/SpacesStore\/540892c1-67d7-4b78-bedf-681b260e3b80",
      creator: {
         forename: "Lawrence",
         surname: "Chavez",
         username: "lchavez"
      },
      created: "2014-03-05T22:25:18.000Z",
      modifier: {
         forename: "Kenneth",
         surname: "Carpenter",
         username: "kcarpenter"
      },
      modified: "2015-02-23T19:19:57.000Z"
   }, {
      title: "Household theft",
      nodeRef: "workspace:\/\/SpacesStore\/ebe4acb3-877c-4e77-9333-3d5371c2ca10",
      creator: {
         forename: "John",
         surname: "Jenkins",
         username: "jjenkins"
      },
      created: "2013-11-11T00:15:18.000Z",
      modifier: {
         forename: "Cynthia",
         surname: "Andrews",
         username: "candrews"
      },
      modified: "2015-01-08T01:17:32.000Z"
   }, {
      title: "Secondary School catchment areas",
      nodeRef: "workspace:\/\/SpacesStore\/cb504618-99b8-43cb-a4d0-235402e41402",
      creator: {
         forename: "Wanda",
         surname: "Payne",
         username: "wpayne"
      },
      created: "2013-09-28T14:40:35.000Z",
      modifier: {
         forename: "Evelyn",
         surname: "Wallace",
         username: "ewallace"
      },
      modified: "2015-08-13T11:13:02.000Z"
   }, {
      title: "Prior Period Adjustments",
      nodeRef: "workspace:\/\/SpacesStore\/ed4fbcc4-e7e6-49cd-92d3-fa172067d050",
      creator: {
         forename: "Kimberly",
         surname: "Hamilton",
         username: "khamilton"
      },
      created: "2014-03-12T12:13:21.000Z",
      modifier: {
         forename: "Jacqueline",
         surname: "Thompson",
         username: "jthompson"
      },
      modified: "2015-08-16T09:56:10.000Z"
   }, {
      title: "Historic contaminated land",
      nodeRef: "workspace:\/\/SpacesStore\/7539f5f3-a871-449d-aedf-5ef1e3f831f9",
      creator: {
         forename: "Ann",
         surname: "Lawson",
         username: "alawson"
      },
      created: "2013-12-28T08:25:12.000Z",
      modifier: {
         forename: "Anthony",
         surname: "Kennedy",
         username: "akennedy"
      },
      modified: "2015-03-20T21:04:24.000Z"
   }, {
      title: "Emissions of Carbon monoxide",
      nodeRef: "workspace:\/\/SpacesStore\/f8e4388e-aa6d-4190-b033-bc8a7341127f",
      creator: {
         forename: "Dorothy",
         surname: "Garcia",
         username: "dgarcia"
      },
      created: "2014-05-26T19:05:07.000Z",
      modifier: {
         forename: "Tammy",
         surname: "Burns",
         username: "tburns"
      },
      modified: "2015-02-16T22:12:06.000Z"
   }, {
      title: "Inspire Maps for Norfolk",
      nodeRef: "workspace:\/\/SpacesStore\/323589af-c1ff-44ec-b2ba-f717eda168d4",
      creator: {
         forename: "Lois",
         surname: "Griffin",
         username: "lgriffin"
      },
      created: "2014-07-13T03:21:21.000Z",
      modifier: {
         forename: "Todd",
         surname: "Griffin",
         username: "tgriffin"
      },
      modified: "2015-05-14T14:07:43.000Z"
   }, {
      title: "KML Format",
      nodeRef: "workspace:\/\/SpacesStore\/a34ba318-c7b3-4400-9127-bb2e5a70e2d6",
      creator: {
         forename: "Ruby",
         surname: "Torres",
         username: "rtorres"
      },
      created: "2014-01-20T08:07:11.000Z",
      modifier: {
         forename: "Frances",
         surname: "Turner",
         username: "fturner"
      },
      modified: "2014-09-18T01:12:51.000Z"
   }, {
      title: "Description of field headers",
      nodeRef: "workspace:\/\/SpacesStore\/d5889055-2946-4b0d-bb66-12a38e9bfc37",
      creator: {
         forename: "Jerry",
         surname: "Bishop",
         username: "jbishop"
      },
      created: "2013-08-22T04:34:09.000Z",
      modifier: {
         forename: "Diana",
         surname: "Cooper",
         username: "dcooper"
      },
      modified: "2015-05-21T00:26:36.000Z"
   }, {
      title: "Cooling tower locations",
      nodeRef: "workspace:\/\/SpacesStore\/3f6fe803-d3a1-47e7-8124-64a62064eb9b",
      creator: {
         forename: "Roy",
         surname: "Mcdonald",
         username: "rmcdonald"
      },
      created: "2013-09-21T21:14:52.000Z",
      modifier: {
         forename: "Louis",
         surname: "Myers",
         username: "lmyers"
      },
      modified: "2015-01-28T13:48:37.000Z"
   }, {
      title: "Revised July QDS data",
      nodeRef: "workspace:\/\/SpacesStore\/c1d9ec61-424f-40d9-ae3b-3e52fc9758f9",
      creator: {
         forename: "Arthur",
         surname: "Bailey",
         username: "abailey"
      },
      created: "2013-12-10T20:08:16.000Z",
      modifier: {
         forename: "Eugene",
         surname: "Cole",
         username: "ecole"
      },
      modified: "2014-12-21T05:59:53.000Z"
   }, {
      title: "Primary Schools",
      nodeRef: "workspace:\/\/SpacesStore\/94b3e63b-f689-421f-8038-51f804b8d4ca",
      creator: {
         forename: "Larry",
         surname: "Parker",
         username: "lparker"
      },
      created: "2013-09-18T09:28:14.000Z",
      modifier: {
         forename: "Keith",
         surname: "Phillips",
         username: "kphillips"
      },
      modified: "2014-09-16T19:56:51.000Z"
   }, {
      title: "Organisation Metadata",
      nodeRef: "workspace:\/\/SpacesStore\/dab57927-23d2-4e59-ab07-26e940bc9a32",
      creator: {
         forename: "Ernest",
         surname: "Castillo",
         username: "ecastillo"
      },
      created: "2013-08-21T23:09:50.000Z",
      modifier: {
         forename: "Annie",
         surname: "Palmer",
         username: "apalmer"
      },
      modified: "2014-12-21T11:51:42.000Z"
   }, {
      title: "National Diabetes Audit",
      nodeRef: "workspace:\/\/SpacesStore\/724d4551-2fbc-4738-ab6b-22f1108bba00",
      creator: {
         forename: "Diane",
         surname: "Allen",
         username: "dallen"
      },
      created: "2013-11-18T18:09:52.000Z",
      modifier: {
         forename: "Ralph",
         surname: "Mccoy",
         username: "rmccoy"
      },
      modified: "2015-05-27T14:42:09.000Z"
   }, {
      title: "Transparency Information",
      nodeRef: "workspace:\/\/SpacesStore\/58385d3a-4e20-4247-8c5a-66de8841a8d9",
      creator: {
         forename: "Sharon",
         surname: "Stevens",
         username: "sstevens"
      },
      created: "2014-08-03T19:05:13.000Z",
      modifier: {
         forename: "Brenda",
         surname: "Simmons",
         username: "bsimmons"
      },
      modified: "2015-06-29T13:27:08.000Z"
   }, {
      title: "Change notice",
      nodeRef: "workspace:\/\/SpacesStore\/bdd03fc3-7192-4d02-bcac-1a4fd494b008",
      creator: {
         forename: "Joan",
         surname: "Snyder",
         username: "jsnyder"
      },
      created: "2014-08-07T14:24:37.000Z",
      modifier: {
         forename: "Alice",
         surname: "Anderson",
         username: "aanderson"
      },
      modified: "2014-08-26T09:52:05.000Z"
   }, {
      title: "ODS Release Schedule",
      nodeRef: "workspace:\/\/SpacesStore\/740af7fd-70c6-4304-99d1-fba836e624d8",
      creator: {
         forename: "Harold",
         surname: "Myers",
         username: "hmyers"
      },
      created: "2013-11-11T13:31:09.000Z",
      modifier: {
         forename: "Eric",
         surname: "Palmer",
         username: "epalmer"
      },
      modified: "2015-02-07T04:43:58.000Z"
   }, {
      title: "Fatal casualty data",
      nodeRef: "workspace:\/\/SpacesStore\/0057ddad-6283-49bf-a94f-41f4a1d5fb09",
      creator: {
         forename: "Marie",
         surname: "Shaw",
         username: "mshaw"
      },
      created: "2014-08-15T15:11:04.000Z",
      modifier: {
         forename: "Kathleen",
         surname: "Butler",
         username: "kbutler"
      },
      modified: "2015-02-13T16:08:48.000Z"
   }, {
      title: "Meetings",
      nodeRef: "workspace:\/\/SpacesStore\/941b3499-8afc-4e7d-b37a-8e3fb0884320",
      creator: {
         forename: "Louise",
         surname: "Kennedy",
         username: "lkennedy"
      },
      created: "2013-10-04T19:23:19.000Z",
      modifier: {
         forename: "Douglas",
         surname: "Montgomery",
         username: "dmontgomery"
      },
      modified: "2014-10-03T10:11:55.000Z"
   }, {
      title: "Council Contracts",
      nodeRef: "workspace:\/\/SpacesStore\/cc4a97b3-1499-48f4-9d64-4485e86a062f",
      creator: {
         forename: "Christine",
         surname: "Wallace",
         username: "cwallace"
      },
      created: "2014-01-15T21:29:12.000Z",
      modifier: {
         forename: "Louise",
         surname: "Garrett",
         username: "lgarrett"
      },
      modified: "2015-05-07T20:24:34.000Z"
   }, {
      title: "Hospital Prescribing",
      nodeRef: "workspace:\/\/SpacesStore\/1e93ce43-1a08-4c3e-9678-edd339dcfb83",
      creator: {
         forename: "Laura",
         surname: "Torres",
         username: "ltorres"
      },
      created: "2014-04-02T00:21:35.000Z",
      modifier: {
         forename: "Samuel",
         surname: "Williams",
         username: "swilliams"
      },
      modified: "2014-09-24T14:01:19.000Z"
   }, {
      title: "South Cambridgeshire",
      nodeRef: "workspace:\/\/SpacesStore\/af523369-af3a-4d02-a702-779db985d5c0",
      creator: {
         forename: "Angela",
         surname: "Chapman",
         username: "achapman"
      },
      created: "2014-07-31T11:35:04.000Z",
      modifier: {
         forename: "Kelly",
         surname: "Lawrence",
         username: "klawrence"
      },
      modified: "2015-07-31T02:31:54.000Z"
   }, {
      title: "ODA Summary",
      nodeRef: "workspace:\/\/SpacesStore\/2d4180b5-c95a-478c-bdac-9e44a681dfc1",
      creator: {
         forename: "Mary",
         surname: "Reynolds",
         username: "mreynolds"
      },
      created: "2014-07-03T18:01:38.000Z",
      modifier: {
         forename: "Cheryl",
         surname: "Reid",
         username: "creid"
      },
      modified: "2015-06-25T14:53:40.000Z"
   }, {
      title: "North Warwickshire",
      nodeRef: "workspace:\/\/SpacesStore\/5079e4db-d86c-49b9-8e04-317c00582033",
      creator: {
         forename: "Wayne",
         surname: "Ruiz",
         username: "wruiz"
      },
      created: "2014-04-01T18:12:46.000Z",
      modifier: {
         forename: "Jacqueline",
         surname: "Watson",
         username: "jwatson"
      },
      modified: "2014-08-21T13:05:42.000Z"
   }, {
      title: "Council Grants",
      nodeRef: "workspace:\/\/SpacesStore\/863cdff8-ab2e-4d8e-b5b6-9e05fd7d5499",
      creator: {
         forename: "Ruth",
         surname: "Montgomery",
         username: "rmontgomery"
      },
      created: "2014-02-08T13:29:13.000Z",
      modifier: {
         forename: "Martha",
         surname: "Fernandez",
         username: "mfernandez"
      },
      modified: "2014-10-13T14:44:03.000Z"
   }, {
      title: "School admission appeals",
      nodeRef: "workspace:\/\/SpacesStore\/66a24814-6cee-4b77-a756-cabdddbdc3b0",
      creator: {
         forename: "Lisa",
         surname: "Rose",
         username: "lrose"
      },
      created: "2014-01-01T14:19:14.000Z",
      modifier: {
         forename: "Jose",
         surname: "Weaver",
         username: "jweaver"
      },
      modified: "2014-09-17T05:37:33.000Z"
   }, {
      title: "National Archives Staff Engagement",
      nodeRef: "workspace:\/\/SpacesStore\/d5999703-d791-4a30-9b23-bac715c3d10b",
      creator: {
         forename: "Terry",
         surname: "Sanchez",
         username: "tsanchez"
      },
      created: "2014-05-02T02:13:57.000Z",
      modifier: {
         forename: "Michael",
         surname: "Fuller",
         username: "mfuller"
      },
      modified: "2015-06-05T20:50:01.000Z"
   }, {
      title: "Staff in Post",
      nodeRef: "workspace:\/\/SpacesStore\/0516a1aa-795e-4689-bf60-5297148f6063",
      creator: {
         forename: "Michelle",
         surname: "Morgan",
         username: "mmorgan"
      },
      created: "2014-07-24T06:16:13.000Z",
      modifier: {
         forename: "Eugene",
         surname: "Brown",
         username: "ebrown"
      },
      modified: "2014-10-28T18:35:05.000Z"
   }, {
      title: "Manchester Transport Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/bb025977-8985-4070-a449-30cab7af199a",
      creator: {
         forename: "Chris",
         surname: "Fowler",
         username: "cfowler"
      },
      created: "2014-02-08T22:36:21.000Z",
      modifier: {
         forename: "Jesse",
         surname: "Simmons",
         username: "jsimmons"
      },
      modified: "2015-03-19T12:58:18.000Z"
   }, {
      title: "Public toilets",
      nodeRef: "workspace:\/\/SpacesStore\/480439df-d3b9-400c-894a-d7d27f224265",
      creator: {
         forename: "Larry",
         surname: "Richardson",
         username: "lrichardson"
      },
      created: "2014-01-16T18:58:36.000Z",
      modifier: {
         forename: "Jean",
         surname: "Cook",
         username: "jcook"
      },
      modified: "2014-11-02T15:01:14.000Z"
   }, {
      title: "Navy Command",
      nodeRef: "workspace:\/\/SpacesStore\/78bd9d7b-064a-4980-81d3-f37a1838d1b5",
      creator: {
         forename: "Roy",
         surname: "Rose",
         username: "rrose"
      },
      created: "2014-02-26T21:07:18.000Z",
      modifier: {
         forename: "Russell",
         surname: "Payne",
         username: "rpayne"
      },
      modified: "2015-07-30T19:32:28.000Z"
   }, {
      title: "Telecoms Data Updates",
      nodeRef: "workspace:\/\/SpacesStore\/0ade5735-0c3a-4a22-a021-73f022d1635a",
      creator: {
         forename: "Ryan",
         surname: "Stanley",
         username: "rstanley"
      },
      created: "2013-10-07T18:40:06.000Z",
      modifier: {
         forename: "James",
         surname: "Torres",
         username: "jtorres"
      },
      modified: "2014-11-01T12:20:04.000Z"
   }, {
      title: "CDR Data Footnotes",
      nodeRef: "workspace:\/\/SpacesStore\/16e461cd-4341-4dac-a5c8-64e0a7001db0",
      creator: {
         forename: "Nancy",
         surname: "Lynch",
         username: "nlynch"
      },
      created: "2013-12-21T03:41:05.000Z",
      modifier: {
         forename: "Sean",
         surname: "Cunningham",
         username: "scunningham"
      },
      modified: "2015-04-27T05:16:25.000Z"
   }, {
      title: "Derbyshire Dales",
      nodeRef: "workspace:\/\/SpacesStore\/91adbe15-ce94-4d25-9c4c-591b7193160a",
      creator: {
         forename: "James",
         surname: "Parker",
         username: "jparker"
      },
      created: "2014-01-05T22:54:45.000Z",
      modifier: {
         forename: "Steven",
         surname: "Richardson",
         username: "srichardson"
      },
      modified: "2015-02-06T09:17:26.000Z"
   }, {
      title: "Air Quality Monitoring",
      nodeRef: "workspace:\/\/SpacesStore\/1356df63-7e5b-45f8-a9c8-f84589161398",
      creator: {
         forename: "Debra",
         surname: "Welch",
         username: "dwelch"
      },
      created: "2014-07-31T10:48:42.000Z",
      modifier: {
         forename: "Betty",
         surname: "Woods",
         username: "bwoods"
      },
      modified: "2014-11-03T08:27:06.000Z"
   }, {
      title: "Air Quality Management Areas",
      nodeRef: "workspace:\/\/SpacesStore\/7a9a3010-396f-448d-847c-d73833e1295d",
      creator: {
         forename: "Justin",
         surname: "Armstrong",
         username: "jarmstrong"
      },
      created: "2014-08-06T11:56:43.000Z",
      modifier: {
         forename: "Patrick",
         surname: "Franklin",
         username: "pfranklin"
      },
      modified: "2015-04-20T11:51:24.000Z"
   }, {
      title: "PCB Quarterly Data",
      nodeRef: "workspace:\/\/SpacesStore\/f73e3b68-8782-4400-be2a-ae09d85ff040",
      creator: {
         forename: "Louis",
         surname: "Lane",
         username: "llane"
      },
      created: "2014-05-15T19:15:51.000Z",
      modifier: {
         forename: "Barbara",
         surname: "Rice",
         username: "brice"
      },
      modified: "2015-03-13T21:06:35.000Z"
   }, {
      title: "Transport Direct Supplementary Data",
      nodeRef: "workspace:\/\/SpacesStore\/6ac756e0-b57a-483e-9417-2ed434c3b4b4",
      creator: {
         forename: "Louise",
         surname: "Ramirez",
         username: "lramirez"
      },
      created: "2014-04-05T02:14:07.000Z",
      modifier: {
         forename: "Jesse",
         surname: "Oliver",
         username: "joliver"
      },
      modified: "2015-04-24T17:34:26.000Z"
   }, {
      title: "Commissioning Support Units",
      nodeRef: "workspace:\/\/SpacesStore\/6225c23a-329a-4881-ae43-219536f0eaa1",
      creator: {
         forename: "Stephen",
         surname: "Wheeler",
         username: "swheeler"
      },
      created: "2014-05-17T11:36:40.000Z",
      modifier: {
         forename: "Anne",
         surname: "Nelson",
         username: "anelson"
      },
      modified: "2014-11-13T15:06:03.000Z"
   }, {
      title: "School By Language",
      nodeRef: "workspace:\/\/SpacesStore\/d280cccf-43d1-490a-871a-61f9944bbae3",
      creator: {
         forename: "Jerry",
         surname: "Graham",
         username: "jgraham"
      },
      created: "2014-01-25T22:39:32.000Z",
      modifier: {
         forename: "Fred",
         surname: "Griffin",
         username: "fgriffin"
      },
      modified: "2014-10-23T15:33:54.000Z"
   }, {
      title: "Organisation level data",
      nodeRef: "workspace:\/\/SpacesStore\/ff4d0d96-8b44-429c-9698-6c953f95ec34",
      creator: {
         forename: "Nancy",
         surname: "Hughes",
         username: "nhughes"
      },
      created: "2013-09-21T02:00:57.000Z",
      modifier: {
         forename: "Mildred",
         surname: "Freeman",
         username: "mfreeman"
      },
      modified: "2014-09-09T14:12:57.000Z"
   }, {
      title: "Open Data Planning Applications",
      nodeRef: "workspace:\/\/SpacesStore\/c7d2ab2f-bb1e-40fd-875a-e177a41ecb97",
      creator: {
         forename: "Chris",
         surname: "Foster",
         username: "cfoster"
      },
      created: "2013-09-15T12:28:02.000Z",
      modifier: {
         forename: "David",
         surname: "Turner",
         username: "dturner"
      },
      modified: "2015-05-05T23:41:14.000Z"
   }, {
      title: "UDA by PCT",
      nodeRef: "workspace:\/\/SpacesStore\/7af7f27e-60d1-40dd-9269-597d11b05a1e",
      creator: {
         forename: "Anne",
         surname: "Lopez",
         username: "alopez"
      },
      created: "2013-10-17T14:00:02.000Z",
      modifier: {
         forename: "Samuel",
         surname: "Owens",
         username: "sowens"
      },
      modified: "2014-08-22T03:50:50.000Z"
   }, {
      title: "Statistical short story",
      nodeRef: "workspace:\/\/SpacesStore\/0f38f215-bb3d-4cc9-a756-94ded54f0ca6",
      creator: {
         forename: "Sharon",
         surname: "Frazier",
         username: "sfrazier"
      },
      created: "2014-06-17T10:30:48.000Z",
      modifier: {
         forename: "Amy",
         surname: "Stone",
         username: "astone"
      },
      modified: "2014-10-03T10:02:07.000Z"
   }, {
      title: "Internal applicants by gender",
      nodeRef: "workspace:\/\/SpacesStore\/45b83b34-3742-4d64-b561-4196cc8f89c6",
      creator: {
         forename: "Jerry",
         surname: "Burton",
         username: "jburton"
      },
      created: "2014-01-15T18:32:29.000Z",
      modifier: {
         forename: "Gary",
         surname: "Cox",
         username: "gcox"
      },
      modified: "2015-01-28T04:40:50.000Z"
   }, {
      title: "PLR Data Template",
      nodeRef: "workspace:\/\/SpacesStore\/f4f3b4b2-9d67-4520-990d-859d1757663e",
      creator: {
         forename: "Bonnie",
         surname: "Bradley",
         username: "bbradley"
      },
      created: "2014-04-27T02:02:55.000Z",
      modifier: {
         forename: "Shawn",
         surname: "Frazier",
         username: "sfrazier"
      },
      modified: "2015-06-11T06:58:36.000Z"
   }, {
      title: "Adult Critical Care Data",
      nodeRef: "workspace:\/\/SpacesStore\/03c5b9e3-c1c6-44c3-a4c3-21dff82e3adc",
      creator: {
         forename: "Stephen",
         surname: "Ramos",
         username: "sramos"
      },
      created: "2014-05-22T01:20:17.000Z",
      modifier: {
         forename: "Annie",
         surname: "Hansen",
         username: "ahansen"
      },
      modified: "2015-01-10T05:27:00.000Z"
   }, {
      title: "Mobile library stops",
      nodeRef: "workspace:\/\/SpacesStore\/07b32025-4d96-4cd6-addb-3ac1d4285f13",
      creator: {
         forename: "Lisa",
         surname: "Perry",
         username: "lperry"
      },
      created: "2013-11-16T15:02:48.000Z",
      modifier: {
         forename: "Roger",
         surname: "Bell",
         username: "rbell"
      },
      modified: "2014-12-02T12:41:19.000Z"
   }, {
      title: "Pesticides in groundwater samples",
      nodeRef: "workspace:\/\/SpacesStore\/cf4199a3-b2c2-4f50-b582-92478666a192",
      creator: {
         forename: "Nicole",
         surname: "Arnold",
         username: "narnold"
      },
      created: "2013-12-11T21:18:09.000Z",
      modifier: {
         forename: "George",
         surname: "Johnson",
         username: "gjohnson"
      },
      modified: "2015-06-22T08:46:01.000Z"
   }, {
      title: "Internal appointments by disability",
      nodeRef: "workspace:\/\/SpacesStore\/087b3978-0a73-4bb8-88d2-a1b37ba66783",
      creator: {
         forename: "Julia",
         surname: "Peterson",
         username: "jpeterson"
      },
      created: "2013-11-21T12:17:44.000Z",
      modifier: {
         forename: "Patrick",
         surname: "Thompson",
         username: "pthompson"
      },
      modified: "2015-03-29T17:12:10.000Z"
   }, {
      title: "Open Data Institute Licence",
      nodeRef: "workspace:\/\/SpacesStore\/b2ad2084-f2ae-4e3f-bb5b-e6b335c29966",
      creator: {
         forename: "Linda",
         surname: "Welch",
         username: "lwelch"
      },
      created: "2014-01-24T18:11:57.000Z",
      modifier: {
         forename: "Tina",
         surname: "Richards",
         username: "trichards"
      },
      modified: "2014-09-13T15:46:10.000Z"
   }, {
      title: "Cambridge Planning Applications",
      nodeRef: "workspace:\/\/SpacesStore\/3809f641-2ee5-4169-bc30-802e710c2308",
      creator: {
         forename: "Benjamin",
         surname: "Robinson",
         username: "brobinson"
      },
      created: "2014-01-09T00:51:47.000Z",
      modifier: {
         forename: "Robin",
         surname: "Murphy",
         username: "rmurphy"
      },
      modified: "2015-01-09T01:03:53.000Z"
   }, {
      title: "Avon and Somerset",
      nodeRef: "workspace:\/\/SpacesStore\/33cb89e3-ce3b-4b7b-8d4e-0cae8b27e714",
      creator: {
         forename: "Janet",
         surname: "Russell",
         username: "jrussell"
      },
      created: "2014-07-08T20:20:57.000Z",
      modifier: {
         forename: "Ernest",
         surname: "Duncan",
         username: "eduncan"
      },
      modified: "2015-07-01T11:43:09.000Z"
   }, {
      title: "Publication scheme",
      nodeRef: "workspace:\/\/SpacesStore\/b3d77b51-371d-4e45-a4c2-95aea4954753",
      creator: {
         forename: "Kelly",
         surname: "Edwards",
         username: "kedwards"
      },
      created: "2014-05-21T16:04:13.000Z",
      modifier: {
         forename: "Steve",
         surname: "Stanley",
         username: "sstanley"
      },
      modified: "2014-10-22T14:40:19.000Z"
   }, {
      title: "Licensing statistics",
      nodeRef: "workspace:\/\/SpacesStore\/6748bf51-b2a5-49d6-9880-db939b969ce5",
      creator: {
         forename: "Jason",
         surname: "Kelly",
         username: "jkelly"
      },
      created: "2014-05-01T02:35:52.000Z",
      modifier: {
         forename: "Mary",
         surname: "Burke",
         username: "mburke"
      },
      modified: "2014-12-18T09:55:46.000Z"
   }, {
      title: "Tonbridge and Malling",
      nodeRef: "workspace:\/\/SpacesStore\/1ea6d393-7511-4c34-83b5-7bc7987a4cf4",
      creator: {
         forename: "Kathryn",
         surname: "Bailey",
         username: "kbailey"
      },
      created: "2014-07-24T20:08:29.000Z",
      modifier: {
         forename: "Bonnie",
         surname: "Ramirez",
         username: "bramirez"
      },
      modified: "2014-08-26T12:13:25.000Z"
   }, {
      title: "Wyre Forest",
      nodeRef: "workspace:\/\/SpacesStore\/34d05cbd-57b7-4922-98b4-312ded19f11a",
      creator: {
         forename: "John",
         surname: "Weaver",
         username: "jweaver"
      },
      created: "2014-02-06T15:12:42.000Z",
      modifier: {
         forename: "Michelle",
         surname: "Powell",
         username: "mpowell"
      },
      modified: "2015-06-17T07:55:49.000Z"
   }, {
      title: "Ninth PICANet Annual Report Tables and Figures pdf",
      nodeRef: "workspace:\/\/SpacesStore\/2fca58bc-7150-4178-8b1e-46dc78f27683",
      creator: {
         forename: "Bobby",
         surname: "Allen",
         username: "ballen"
      },
      created: "2014-03-10T19:54:00.000Z",
      modifier: {
         forename: "Henry",
         surname: "Ward",
         username: "hward"
      },
      modified: "2015-04-29T16:21:16.000Z"
   }, {
      title: "Additional Data",
      nodeRef: "workspace:\/\/SpacesStore\/fd1d4e70-b87e-4175-b436-4f0ed3399986",
      creator: {
         forename: "Karen",
         surname: "Burns",
         username: "kburns"
      },
      created: "2013-09-19T04:08:14.000Z",
      modifier: {
         forename: "Alice",
         surname: "Kennedy",
         username: "akennedy"
      },
      modified: "2015-06-09T06:53:58.000Z"
   }, {
      title: "Summary tables",
      nodeRef: "workspace:\/\/SpacesStore\/b209c6f9-df33-4cc7-af59-3c19b315c9f2",
      creator: {
         forename: "Kimberly",
         surname: "Parker",
         username: "kparker"
      },
      created: "2014-03-21T22:34:26.000Z",
      modifier: {
         forename: "Edward",
         surname: "Frazier",
         username: "efrazier"
      },
      modified: "2015-05-13T12:41:07.000Z"
   }, {
      title: "Mineral Safeguarding Zones",
      nodeRef: "workspace:\/\/SpacesStore\/c345eed6-315c-477d-9f30-e5f7c1a9d3b4",
      creator: {
         forename: "Roger",
         surname: "Carter",
         username: "rcarter"
      },
      created: "2013-11-03T22:15:53.000Z",
      modifier: {
         forename: "Amanda",
         surname: "Franklin",
         username: "afranklin"
      },
      modified: "2015-02-16T13:21:37.000Z"
   }, {
      title: "All Participation and Achievements",
      nodeRef: "workspace:\/\/SpacesStore\/1d38d1ac-6b84-460a-a414-d54fbc2ff880",
      creator: {
         forename: "Larry",
         surname: "Williamson",
         username: "lwilliamson"
      },
      created: "2013-09-07T02:57:27.000Z",
      modifier: {
         forename: "Diane",
         surname: "Little",
         username: "dlittle"
      },
      modified: "2015-04-02T16:10:11.000Z"
   }, {
      title: "Internal applicants by gender",
      nodeRef: "workspace:\/\/SpacesStore\/9c07b4e5-5f38-44ea-8a0b-2c4e3f16fb48",
      creator: {
         forename: "Walter",
         surname: "Griffin",
         username: "wgriffin"
      },
      created: "2013-10-29T05:33:58.000Z",
      modifier: {
         forename: "Joshua",
         surname: "Fuller",
         username: "jfuller"
      },
      modified: "2015-07-25T02:49:32.000Z"
   }, {
      title: "Penalty Charge Notices Issued",
      nodeRef: "workspace:\/\/SpacesStore\/d0614775-0ec8-445f-9e04-660646c910cc",
      creator: {
         forename: "Betty",
         surname: "Romero",
         username: "bromero"
      },
      created: "2013-08-22T07:14:24.000Z",
      modifier: {
         forename: "Kathy",
         surname: "Perry",
         username: "kperry"
      },
      modified: "2015-01-16T13:11:56.000Z"
   }, {
      title: "Holding document",
      nodeRef: "workspace:\/\/SpacesStore\/fb142a8f-3ce2-457d-ba3f-bca4cff3cf80",
      creator: {
         forename: "Marilyn",
         surname: "Smith",
         username: "msmith"
      },
      created: "2014-07-11T08:00:58.000Z",
      modifier: {
         forename: "Barbara",
         surname: "Stephens",
         username: "bstephens"
      },
      modified: "2015-02-10T01:14:07.000Z"
   }, {
      title: "HSCIC Workforce data",
      nodeRef: "workspace:\/\/SpacesStore\/562f1ef5-57e8-4b40-978f-24362264d820",
      creator: {
         forename: "Gloria",
         surname: "Hart",
         username: "ghart"
      },
      created: "2014-04-23T07:01:18.000Z",
      modifier: {
         forename: "Anthony",
         surname: "Carpenter",
         username: "acarpenter"
      },
      modified: "2015-08-06T12:13:06.000Z"
   }, {
      title: "HQIP NCAPOP Page",
      nodeRef: "workspace:\/\/SpacesStore\/bde8880a-82ca-4215-948d-be5c66158f0d",
      creator: {
         forename: "Robert",
         surname: "Murphy",
         username: "rmurphy"
      },
      created: "2014-08-17T14:19:41.000Z",
      modifier: {
         forename: "Carolyn",
         surname: "King",
         username: "cking"
      },
      modified: "2015-03-26T01:17:55.000Z"
   }, {
      title: "NPDA Data field description",
      nodeRef: "workspace:\/\/SpacesStore\/9df1d411-79aa-4f41-b575-b55ca8a98526",
      creator: {
         forename: "Stephanie",
         surname: "Mills",
         username: "smills"
      },
      created: "2014-03-12T15:39:26.000Z",
      modifier: {
         forename: "Brandon",
         surname: "Davis",
         username: "bdavis"
      },
      modified: "2014-11-06T19:29:01.000Z"
   }, {
      title: "Public toilets schema guidance",
      nodeRef: "workspace:\/\/SpacesStore\/b9e4c785-4c35-4c98-9235-a12cc5d9b2fc",
      creator: {
         forename: "Annie",
         surname: "Hunter",
         username: "ahunter"
      },
      created: "2013-10-17T15:10:14.000Z",
      modifier: {
         forename: "Debra",
         surname: "Cunningham",
         username: "dcunningham"
      },
      modified: "2015-01-06T11:05:37.000Z"
   }, {
      title: "Leavers by religion",
      nodeRef: "workspace:\/\/SpacesStore\/6e555360-9958-4105-a2d4-bc7eff4ccb65",
      creator: {
         forename: "Eric",
         surname: "Hicks",
         username: "ehicks"
      },
      created: "2013-10-10T04:51:50.000Z",
      modifier: {
         forename: "Donald",
         surname: "Wallace",
         username: "dwallace"
      },
      modified: "2015-05-01T00:13:18.000Z"
   }, {
      title: "West Lancashire",
      nodeRef: "workspace:\/\/SpacesStore\/8c81041b-d9c6-40bc-a4d9-e6eabfd7d1af",
      creator: {
         forename: "Marie",
         surname: "Cruz",
         username: "mcruz"
      },
      created: "2014-01-10T20:40:03.000Z",
      modifier: {
         forename: "Sandra",
         surname: "Romero",
         username: "sromero"
      },
      modified: "2014-11-05T15:07:31.000Z"
   }, {
      title: "Free School Meals",
      nodeRef: "workspace:\/\/SpacesStore\/7e6991a0-1017-45b6-a19e-f4eeff3fc8af",
      creator: {
         forename: "Juan",
         surname: "Miller",
         username: "jmiller"
      },
      created: "2013-11-01T03:42:34.000Z",
      modifier: {
         forename: "Todd",
         surname: "Parker",
         username: "tparker"
      },
      modified: "2014-10-06T07:43:05.000Z"
   }, {
      title: "Tariff index",
      nodeRef: "workspace:\/\/SpacesStore\/3197e471-f530-41b9-8e7b-ef218eb62683",
      creator: {
         forename: "Karen",
         surname: "Clark",
         username: "kclark"
      },
      created: "2014-04-07T11:35:41.000Z",
      modifier: {
         forename: "Benjamin",
         surname: "Wood",
         username: "bwood"
      },
      modified: "2014-10-15T14:47:45.000Z"
   }, {
      title: "Empty homes",
      nodeRef: "workspace:\/\/SpacesStore\/52a6ceef-4667-4ff6-b9df-a8a68c07bcbd",
      creator: {
         forename: "Tina",
         surname: "Ramirez",
         username: "tramirez"
      },
      created: "2014-03-06T21:37:50.000Z",
      modifier: {
         forename: "Michelle",
         surname: "Mills",
         username: "mmills"
      },
      modified: "2015-08-07T02:49:08.000Z"
   }, {
      title: "Flood warnings",
      nodeRef: "workspace:\/\/SpacesStore\/4f00297a-dffa-47b9-a6a0-f750af70cfad",
      creator: {
         forename: "Roy",
         surname: "Mccoy",
         username: "rmccoy"
      },
      created: "2013-10-12T19:39:55.000Z",
      modifier: {
         forename: "Joshua",
         surname: "Fields",
         username: "jfields"
      },
      modified: "2015-01-13T18:39:34.000Z"
   }, {
      title: "Internal applicants by disability",
      nodeRef: "workspace:\/\/SpacesStore\/fe2bb52f-6eaf-43a9-893d-a4c66e47bc44",
      creator: {
         forename: "Virginia",
         surname: "Dean",
         username: "vdean"
      },
      created: "2014-01-21T23:08:05.000Z",
      modifier: {
         forename: "Kathy",
         surname: "Gonzalez",
         username: "kgonzalez"
      },
      modified: "2014-09-23T18:16:20.000Z"
   }, {
      title: "Appendix tables",
      nodeRef: "workspace:\/\/SpacesStore\/8fc7e031-8d02-47d3-b661-4839626a1094",
      creator: {
         forename: "Pamela",
         surname: "Peters",
         username: "ppeters"
      },
      created: "2014-02-03T20:27:02.000Z",
      modifier: {
         forename: "Robin",
         surname: "Cunningham",
         username: "rcunningham"
      },
      modified: "2014-09-06T17:41:18.000Z"
   }, {
      title: "Fraud investigations",
      nodeRef: "workspace:\/\/SpacesStore\/61851905-ab8f-4e6b-87e8-6c1dd8bfb903",
      creator: {
         forename: "Jason",
         surname: "Brooks",
         username: "jbrooks"
      },
      created: "2014-01-26T03:44:07.000Z",
      modifier: {
         forename: "Patrick",
         surname: "Rice",
         username: "price"
      },
      modified: "2015-05-11T11:15:49.000Z"
   }, {
      title: "Remuneration report February",
      nodeRef: "workspace:\/\/SpacesStore\/033e88c9-3e2d-43c9-a9c5-36da898dcf8c",
      creator: {
         forename: "Katherine",
         surname: "Lynch",
         username: "klynch"
      },
      created: "2014-07-12T01:13:26.000Z",
      modifier: {
         forename: "Heather",
         surname: "Rice",
         username: "hrice"
      },
      modified: "2014-11-25T22:26:12.000Z"
   }, {
      title: "Cycle shops map data",
      nodeRef: "workspace:\/\/SpacesStore\/9ce623f3-4d3b-4fab-97c4-10b66b99883a",
      creator: {
         forename: "Margaret",
         surname: "Gardner",
         username: "mgardner"
      },
      created: "2013-12-13T20:53:49.000Z",
      modifier: {
         forename: "Mary",
         surname: "Lynch",
         username: "mlynch"
      },
      modified: "2015-01-18T07:15:38.000Z"
   }, {
      title: "East Northamptonshire",
      nodeRef: "workspace:\/\/SpacesStore\/3d473f5e-330a-48db-ad76-8f86714dd8d8",
      creator: {
         forename: "Willie",
         surname: "Anderson",
         username: "wanderson"
      },
      created: "2014-08-02T21:11:24.000Z",
      modifier: {
         forename: "John",
         surname: "Bowman",
         username: "jbowman"
      },
      modified: "2014-10-21T04:07:46.000Z"
   }, {
      title: "Discretionary housing payments",
      nodeRef: "workspace:\/\/SpacesStore\/79254cba-47ae-46fb-a886-3951be669fee",
      creator: {
         forename: "Julia",
         surname: "Ford",
         username: "jford"
      },
      created: "2014-05-27T00:43:31.000Z",
      modifier: {
         forename: "Catherine",
         surname: "Mills",
         username: "cmills"
      },
      modified: "2014-12-03T17:07:43.000Z"
   }, {
      title: "Type of estbalishment",
      nodeRef: "workspace:\/\/SpacesStore\/558a0126-4bca-48e8-8875-538d23ad804e",
      creator: {
         forename: "Amanda",
         surname: "Taylor",
         username: "ataylor"
      },
      created: "2013-11-07T14:52:34.000Z",
      modifier: {
         forename: "Aaron",
         surname: "Adams",
         username: "aadams"
      },
      modified: "2015-07-31T04:59:00.000Z"
   }, {
      title: "Open Spaces",
      nodeRef: "workspace:\/\/SpacesStore\/5c41af2d-579b-47e4-83a5-c47fc6a3d1e4",
      creator: {
         forename: "Matthew",
         surname: "Lynch",
         username: "mlynch"
      },
      created: "2014-01-05T14:30:31.000Z",
      modifier: {
         forename: "Amanda",
         surname: "Hudson",
         username: "ahudson"
      },
      modified: "2015-08-18T07:02:07.000Z"
   }, {
      title: "Cycle locker map data",
      nodeRef: "workspace:\/\/SpacesStore\/e513109e-fb30-4be0-8b65-811fc3aef74c",
      creator: {
         forename: "Judith",
         surname: "Garrett",
         username: "jgarrett"
      },
      created: "2014-07-09T08:15:02.000Z",
      modifier: {
         forename: "Nicole",
         surname: "Thompson",
         username: "nthompson"
      },
      modified: "2014-11-04T02:55:18.000Z"
   }, {
      title: "Contracts Register",
      nodeRef: "workspace:\/\/SpacesStore\/988234a3-aadc-4c77-8c3b-d9c287c26144",
      creator: {
         forename: "Aaron",
         surname: "Rodriguez",
         username: "arodriguez"
      },
      created: "2014-02-07T16:13:56.000Z",
      modifier: {
         forename: "Mary",
         surname: "Little",
         username: "mlittle"
      },
      modified: "2014-12-19T09:58:41.000Z"
   }, {
      title: "Mineral Consultation Areas",
      nodeRef: "workspace:\/\/SpacesStore\/fa3d3d15-c51c-4911-a791-a44430398be6",
      creator: {
         forename: "Sean",
         surname: "Bell",
         username: "sbell"
      },
      created: "2013-10-01T08:11:28.000Z",
      modifier: {
         forename: "Ruby",
         surname: "Stone",
         username: "rstone"
      },
      modified: "2014-09-11T20:40:02.000Z"
   }, {
      title: "English Indices of Deprivation",
      nodeRef: "workspace:\/\/SpacesStore\/a7f7d9bc-a166-4765-aacf-c16928f0dd38",
      creator: {
         forename: "Mary",
         surname: "Bailey",
         username: "mbailey"
      },
      created: "2014-03-28T19:54:16.000Z",
      modifier: {
         forename: "David",
         surname: "Howell",
         username: "dhowell"
      },
      modified: "2015-04-01T14:00:23.000Z"
   }, {
      title: "Senior Officials hospitality",
      nodeRef: "workspace:\/\/SpacesStore\/55fa4e71-44d3-4c3e-a4d9-ca354313969c",
      creator: {
         forename: "Timothy",
         surname: "Lawson",
         username: "tlawson"
      },
      created: "2013-11-18T17:06:47.000Z",
      modifier: {
         forename: "Frank",
         surname: "Hernandez",
         username: "fhernandez"
      },
      modified: "2015-05-28T03:18:21.000Z"
   }, {
      title: "Open Space",
      nodeRef: "workspace:\/\/SpacesStore\/34fc9363-885c-470a-9ec9-7992f56510e5",
      creator: {
         forename: "Melissa",
         surname: "Carr",
         username: "mcarr"
      },
      created: "2014-04-05T22:09:20.000Z",
      modifier: {
         forename: "Roy",
         surname: "Grant",
         username: "rgrant"
      },
      modified: "2015-06-26T22:08:42.000Z"
   }, {
      title: "Qualification Success Rates",
      nodeRef: "workspace:\/\/SpacesStore\/0ca901df-5b0f-4c8f-b836-49ddd5b9b993",
      creator: {
         forename: "William",
         surname: "Wallace",
         username: "wwallace"
      },
      created: "2014-04-29T09:53:25.000Z",
      modifier: {
         forename: "Debra",
         surname: "Hawkins",
         username: "dhawkins"
      },
      modified: "2014-08-24T15:55:13.000Z"
   }, {
      title: "Town and Village Greens",
      nodeRef: "workspace:\/\/SpacesStore\/7960eb02-f2ce-4008-a13e-f88169740eb4",
      creator: {
         forename: "Gary",
         surname: "Hayes",
         username: "ghayes"
      },
      created: "2013-09-21T19:53:20.000Z",
      modifier: {
         forename: "Betty",
         surname: "Howard",
         username: "bhoward"
      },
      modified: "2014-08-28T08:07:44.000Z"
   }, {
      title: "Fraud Strategy",
      nodeRef: "workspace:\/\/SpacesStore\/e5904955-8b3b-4a0d-a0e9-d9ea8165392d",
      creator: {
         forename: "Julia",
         surname: "Freeman",
         username: "jfreeman"
      },
      created: "2014-05-27T01:25:31.000Z",
      modifier: {
         forename: "Anna",
         surname: "Duncan",
         username: "aduncan"
      },
      modified: "2014-09-21T08:26:35.000Z"
   }, {
      title: "Frozen animals",
      nodeRef: "workspace:\/\/SpacesStore\/b115cc3e-47b0-4884-9258-8daa5999ce97",
      creator: {
         forename: "Patricia",
         surname: "Allen",
         username: "pallen"
      },
      created: "2014-04-28T22:12:44.000Z",
      modifier: {
         forename: "Brian",
         surname: "Wallace",
         username: "bwallace"
      },
      modified: "2015-02-27T03:37:13.000Z"
   }, {
      title: "Rochdale main report",
      nodeRef: "workspace:\/\/SpacesStore\/babbcb98-0f7f-4f6d-a03f-4d85ba661bb9",
      creator: {
         forename: "Mary",
         surname: "Rice",
         username: "mrice"
      },
      created: "2014-04-09T23:42:57.000Z",
      modifier: {
         forename: "Sharon",
         surname: "Burton",
         username: "sburton"
      },
      modified: "2015-04-12T06:31:10.000Z"
   }, {
      title: "Town Centre Classification",
      nodeRef: "workspace:\/\/SpacesStore\/1eb472b2-b206-401a-b747-fd86869ee400",
      creator: {
         forename: "Nicholas",
         surname: "Fowler",
         username: "nfowler"
      },
      created: "2013-09-26T03:24:31.000Z",
      modifier: {
         forename: "Jonathan",
         surname: "Chapman",
         username: "jchapman"
      },
      modified: "2015-08-13T23:01:54.000Z"
   }, {
      title: "Headline Success Rates",
      nodeRef: "workspace:\/\/SpacesStore\/7c51185c-03d3-4794-af1a-494240f82bb6",
      creator: {
         forename: "Carl",
         surname: "Riley",
         username: "criley"
      },
      created: "2014-01-03T02:20:38.000Z",
      modifier: {
         forename: "Angela",
         surname: "Austin",
         username: "aaustin"
      },
      modified: "2015-06-03T00:41:59.000Z"
   }, {
      title: "Addicts index data",
      nodeRef: "workspace:\/\/SpacesStore\/1293a01a-11e4-4bfa-b2f5-86aaadf71f3e",
      creator: {
         forename: "Mildred",
         surname: "Ford",
         username: "mford"
      },
      created: "2014-01-20T03:37:44.000Z",
      modifier: {
         forename: "Sean",
         surname: "Dixon",
         username: "sdixon"
      },
      modified: "2015-01-07T05:25:51.000Z"
   }, {
      title: "Grievance cases by gender",
      nodeRef: "workspace:\/\/SpacesStore\/3bec9e74-3c16-406a-ab70-77b107f45c00",
      creator: {
         forename: "Charles",
         surname: "Lee",
         username: "clee"
      },
      created: "2014-07-17T15:56:27.000Z",
      modifier: {
         forename: "Joshua",
         surname: "Perry",
         username: "jperry"
      },
      modified: "2015-05-14T11:22:31.000Z"
   }, {
      title: "Grants to Voluntary Sector",
      nodeRef: "workspace:\/\/SpacesStore\/cf78f6b9-8120-47a3-9e07-316f23767d3a",
      creator: {
         forename: "Donald",
         surname: "Schmidt",
         username: "dschmidt"
      },
      created: "2014-07-05T06:09:19.000Z",
      modifier: {
         forename: "Kenneth",
         surname: "Welch",
         username: "kwelch"
      },
      modified: "2015-06-24T19:19:31.000Z"
   }, {
      title: "Public Access",
      nodeRef: "workspace:\/\/SpacesStore\/72ab6a7a-be9d-4a18-af65-baca3d55b6b8",
      creator: {
         forename: "Andrew",
         surname: "Evans",
         username: "aevans"
      },
      created: "2013-11-23T08:48:05.000Z",
      modifier: {
         forename: "Charles",
         surname: "Crawford",
         username: "ccrawford"
      },
      modified: "2015-06-30T05:58:24.000Z"
   }, {
      title: "National Success Rate Tables",
      nodeRef: "workspace:\/\/SpacesStore\/73e12dd5-047e-464b-8075-52222125aeb0",
      creator: {
         forename: "Louise",
         surname: "Sanders",
         username: "lsanders"
      },
      created: "2014-01-11T10:25:25.000Z",
      modifier: {
         forename: "Michael",
         surname: "Ruiz",
         username: "mruiz"
      },
      modified: "2015-01-16T13:39:37.000Z"
   }, {
      title: "Senior Salaries Metadata",
      nodeRef: "workspace:\/\/SpacesStore\/bcc47868-4f7c-4d3d-ada3-32f7239d7267",
      creator: {
         forename: "Judy",
         surname: "Stephens",
         username: "jstephens"
      },
      created: "2013-11-14T03:21:13.000Z",
      modifier: {
         forename: "Nicole",
         surname: "Lane",
         username: "nlane"
      },
      modified: "2015-01-11T21:47:44.000Z"
   }, {
      title: "NJR Website",
      nodeRef: "workspace:\/\/SpacesStore\/ea773a4b-1672-48ed-b63b-8936aea6e676",
      creator: {
         forename: "Kelly",
         surname: "Lynch",
         username: "klynch"
      },
      created: "2014-07-25T03:08:58.000Z",
      modifier: {
         forename: "Donna",
         surname: "Ryan",
         username: "dryan"
      },
      modified: "2014-12-08T05:12:27.000Z"
   }, {
      title: "DECC Electricity use",
      nodeRef: "workspace:\/\/SpacesStore\/b6a5937f-c2c0-4401-8dc8-5073df5690cf",
      creator: {
         forename: "Howard",
         surname: "Peters",
         username: "hpeters"
      },
      created: "2013-10-06T03:18:50.000Z",
      modifier: {
         forename: "Sean",
         surname: "Coleman",
         username: "scoleman"
      },
      modified: "2015-07-05T06:59:52.000Z"
   }, {
      title: "List of courts",
      nodeRef: "workspace:\/\/SpacesStore\/d3dc3084-c132-43fa-a0ba-0b865a29ef30",
      creator: {
         forename: "Ryan",
         surname: "Burton",
         username: "rburton"
      },
      created: "2014-03-03T19:51:37.000Z",
      modifier: {
         forename: "Antonio",
         surname: "James",
         username: "ajames"
      },
      modified: "2015-01-03T05:14:23.000Z"
   }, {
      title: "Cannock Chase",
      nodeRef: "workspace:\/\/SpacesStore\/4e6e7d48-cffd-43af-80e5-d90892ecb0df",
      creator: {
         forename: "Kathryn",
         surname: "Moore",
         username: "kmoore"
      },
      created: "2014-03-01T17:37:24.000Z",
      modifier: {
         forename: "Jeremy",
         surname: "Palmer",
         username: "jpalmer"
      },
      modified: "2015-07-30T13:24:52.000Z"
   }, {
      title: "Schools Surplus",
      nodeRef: "workspace:\/\/SpacesStore\/ca26f2fc-6b17-479f-a9a8-61c3a3b5e483",
      creator: {
         forename: "Kevin",
         surname: "Sullivan",
         username: "ksullivan"
      },
      created: "2014-01-28T08:33:32.000Z",
      modifier: {
         forename: "Tammy",
         surname: "Robinson",
         username: "trobinson"
      },
      modified: "2015-06-05T07:34:23.000Z"
   }, {
      title: "Junior Staff Data",
      nodeRef: "workspace:\/\/SpacesStore\/c118891f-a14c-4b66-93e0-69992b5d8cbd",
      creator: {
         forename: "Billy",
         surname: "Cruz",
         username: "bcruz"
      },
      created: "2014-07-24T22:50:35.000Z",
      modifier: {
         forename: "Jonathan",
         surname: "Davis",
         username: "jdavis"
      },
      modified: "2015-01-02T13:22:49.000Z"
   }, {
      title: "Play areas",
      nodeRef: "workspace:\/\/SpacesStore\/09fce4e7-78b2-4f75-ab30-5bb77c36a259",
      creator: {
         forename: "Katherine",
         surname: "Carpenter",
         username: "kcarpenter"
      },
      created: "2013-12-17T03:35:19.000Z",
      modifier: {
         forename: "George",
         surname: "Robertson",
         username: "grobertson"
      },
      modified: "2014-12-27T00:06:26.000Z"
   }, {
      title: "Terms of reference",
      nodeRef: "workspace:\/\/SpacesStore\/abc738b2-5bcb-4d08-ac55-4416625086ed",
      creator: {
         forename: "Johnny",
         surname: "Watson",
         username: "jwatson"
      },
      created: "2014-08-03T14:26:08.000Z",
      modifier: {
         forename: "Douglas",
         surname: "Flores",
         username: "dflores"
      },
      modified: "2015-03-19T16:17:21.000Z"
   }, {
      title: "Historical energy data",
      nodeRef: "workspace:\/\/SpacesStore\/05ff0973-f99f-4ad2-a57e-bfeac67a3647",
      creator: {
         forename: "Kelly",
         surname: "Fox",
         username: "kfox"
      },
      created: "2013-09-06T18:31:17.000Z",
      modifier: {
         forename: "Richard",
         surname: "Burns",
         username: "rburns"
      },
      modified: "2015-01-31T15:58:02.000Z"
   }, {
      title: "PCI activity per centre",
      nodeRef: "workspace:\/\/SpacesStore\/b6b6e573-6fe2-45aa-bdbc-26203d6ff4c6",
      creator: {
         forename: "Mildred",
         surname: "Mccoy",
         username: "mmccoy"
      },
      created: "2014-03-18T20:16:14.000Z",
      modifier: {
         forename: "Carl",
         surname: "Harvey",
         username: "charvey"
      },
      modified: "2014-11-10T10:22:15.000Z"
   }, {
      title: "Bolton Transport Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/f998d7db-3c03-4992-897f-f52c7191f04b",
      creator: {
         forename: "Alice",
         surname: "Ford",
         username: "aford"
      },
      created: "2014-04-08T13:22:35.000Z",
      modifier: {
         forename: "Wanda",
         surname: "Edwards",
         username: "wedwards"
      },
      modified: "2014-11-19T07:25:29.000Z"
   }, {
      title: "Premises Licenses",
      nodeRef: "workspace:\/\/SpacesStore\/e4766996-7ba9-4092-b0ac-cdcaf7e085a7",
      creator: {
         forename: "Bruce",
         surname: "Hawkins",
         username: "bhawkins"
      },
      created: "2014-01-19T15:03:13.000Z",
      modifier: {
         forename: "Timothy",
         surname: "Burton",
         username: "tburton"
      },
      modified: "2015-05-24T19:30:57.000Z"
   }, {
      title: "Senior Officials business expenses",
      nodeRef: "workspace:\/\/SpacesStore\/2f4a9763-cdad-4853-b366-8d7db97965f2",
      creator: {
         forename: "Julie",
         surname: "Hudson",
         username: "jhudson"
      },
      created: "2013-09-22T11:47:20.000Z",
      modifier: {
         forename: "Ryan",
         surname: "Clark",
         username: "rclark"
      },
      modified: "2015-06-25T17:17:53.000Z"
   }, {
      title: "Home page",
      nodeRef: "workspace:\/\/SpacesStore\/b1f7e43c-adc9-48d4-8468-880f1846e568",
      creator: {
         forename: "Angela",
         surname: "Carr",
         username: "acarr"
      },
      created: "2014-08-11T01:01:12.000Z",
      modifier: {
         forename: "Jerry",
         surname: "Garcia",
         username: "jgarcia"
      },
      modified: "2014-10-31T06:01:56.000Z"
   }, {
      title: "May Annex data",
      nodeRef: "workspace:\/\/SpacesStore\/0e5d51f1-8b8c-40c0-bcbd-b0579c441cb1",
      creator: {
         forename: "Debra",
         surname: "Kelley",
         username: "dkelley"
      },
      created: "2014-03-09T05:52:33.000Z",
      modifier: {
         forename: "Timothy",
         surname: "Willis",
         username: "twillis"
      },
      modified: "2015-08-13T08:25:02.000Z"
   }, {
      title: "Senior staff salaries",
      nodeRef: "workspace:\/\/SpacesStore\/5d2ac3d8-dcf6-4032-975e-ae5bad109b59",
      creator: {
         forename: "Walter",
         surname: "Lawrence",
         username: "wlawrence"
      },
      created: "2013-11-11T15:56:52.000Z",
      modifier: {
         forename: "Amy",
         surname: "Burton",
         username: "aburton"
      },
      modified: "2015-07-30T15:25:13.000Z"
   }, {
      title: "Archive of data",
      nodeRef: "workspace:\/\/SpacesStore\/21e282f3-61e9-447f-bbc5-1d4853d6d9cd",
      creator: {
         forename: "Alan",
         surname: "Peters",
         username: "apeters"
      },
      created: "2013-09-12T15:03:12.000Z",
      modifier: {
         forename: "Carl",
         surname: "Gutierrez",
         username: "cgutierrez"
      },
      modified: "2015-05-23T03:00:30.000Z"
   }, {
      title: "Expenditure Infomation",
      nodeRef: "workspace:\/\/SpacesStore\/b934781a-b366-4083-939a-b5b4705b9822",
      creator: {
         forename: "Catherine",
         surname: "Bryant",
         username: "cbryant"
      },
      created: "2014-04-09T15:01:19.000Z",
      modifier: {
         forename: "Joyce",
         surname: "Morris",
         username: "jmorris"
      },
      modified: "2014-12-29T21:39:47.000Z"
   }, {
      title: "Institution Success Rates",
      nodeRef: "workspace:\/\/SpacesStore\/27d59ca4-244c-48f1-9a6e-864d653cf10d",
      creator: {
         forename: "Annie",
         surname: "Harvey",
         username: "aharvey"
      },
      created: "2014-05-05T02:31:20.000Z",
      modifier: {
         forename: "Ruby",
         surname: "Richards",
         username: "rrichards"
      },
      modified: "2014-09-10T07:37:32.000Z"
   }, {
      title: "Statistical First Release Tables",
      nodeRef: "workspace:\/\/SpacesStore\/8edcdbf0-b729-456c-b2d1-b1c345a52cad",
      creator: {
         forename: "Patricia",
         surname: "Sims",
         username: "psims"
      },
      created: "2014-03-20T12:11:59.000Z",
      modifier: {
         forename: "Christina",
         surname: "Sullivan",
         username: "csullivan"
      },
      modified: "2014-11-10T17:51:34.000Z"
   }, {
      title: "Survey of Adult Carers",
      nodeRef: "workspace:\/\/SpacesStore\/34c3b35f-181e-4493-9d19-79f283d6d06f",
      creator: {
         forename: "Roy",
         surname: "Lewis",
         username: "rlewis"
      },
      created: "2013-11-18T02:45:33.000Z",
      modifier: {
         forename: "Christine",
         surname: "Brown",
         username: "cbrown"
      },
      modified: "2014-12-20T17:50:45.000Z"
   }, {
      title: "Statistics at HCA",
      nodeRef: "workspace:\/\/SpacesStore\/c1f2a2cc-0280-4d45-a942-bf3ac0e9ae83",
      creator: {
         forename: "Barbara",
         surname: "Meyer",
         username: "bmeyer"
      },
      created: "2013-10-24T21:53:41.000Z",
      modifier: {
         forename: "Henry",
         surname: "Murphy",
         username: "hmurphy"
      },
      modified: "2014-12-01T10:12:40.000Z"
   }, {
      title: "Monthly Summary Data",
      nodeRef: "workspace:\/\/SpacesStore\/bcecef45-7bf9-471c-b4a1-1fb97ce8af53",
      creator: {
         forename: "Jacqueline",
         surname: "Dunn",
         username: "jdunn"
      },
      created: "2014-01-22T02:44:28.000Z",
      modifier: {
         forename: "Laura",
         surname: "Daniels",
         username: "ldaniels"
      },
      modified: "2014-10-02T11:43:36.000Z"
   }, {
      title: "Disciplinary cases by disability",
      nodeRef: "workspace:\/\/SpacesStore\/e197ad1a-c4f4-43de-85f0-96fba6f59d5a",
      creator: {
         forename: "Kelly",
         surname: "Phillips",
         username: "kphillips"
      },
      created: "2013-11-29T03:57:59.000Z",
      modifier: {
         forename: "Frances",
         surname: "Gonzales",
         username: "fgonzales"
      },
      modified: "2014-11-28T17:56:32.000Z"
   }, {
      title: "House Price Data",
      nodeRef: "workspace:\/\/SpacesStore\/79e906c7-ba01-4027-b1a1-c325b7245f2d",
      creator: {
         forename: "Frank",
         surname: "Spencer",
         username: "fspencer"
      },
      created: "2014-06-24T16:45:53.000Z",
      modifier: {
         forename: "Julia",
         surname: "Hall",
         username: "jhall"
      },
      modified: "2015-05-01T18:14:41.000Z"
   }, {
      title: "Blaby Business Rates Information",
      nodeRef: "workspace:\/\/SpacesStore\/dc33ddbc-bd4b-4361-9afb-a44ab0a392d0",
      creator: {
         forename: "Susan",
         surname: "Gray",
         username: "sgray"
      },
      created: "2013-11-19T13:12:00.000Z",
      modifier: {
         forename: "Eugene",
         surname: "Palmer",
         username: "epalmer"
      },
      modified: "2015-07-31T15:56:53.000Z"
   }, {
      title: "Mid Suffolk",
      nodeRef: "workspace:\/\/SpacesStore\/7a4f8f10-03af-406b-bf53-73b2ca059ed2",
      creator: {
         forename: "Katherine",
         surname: "Owens",
         username: "kowens"
      },
      created: "2014-05-13T09:23:22.000Z",
      modifier: {
         forename: "Ruth",
         surname: "Ruiz",
         username: "rruiz"
      },
      modified: "2015-04-18T05:17:34.000Z"
   }, {
      title: "Planning Application Register",
      nodeRef: "workspace:\/\/SpacesStore\/4aafde5a-1e6c-482e-9f54-77b4f0e6aeca",
      creator: {
         forename: "Julia",
         surname: "Adams",
         username: "jadams"
      },
      created: "2014-04-13T03:17:44.000Z",
      modifier: {
         forename: "Willie",
         surname: "Mcdonald",
         username: "wmcdonald"
      },
      modified: "2014-09-23T19:57:00.000Z"
   }, {
      title: "Schools in England",
      nodeRef: "workspace:\/\/SpacesStore\/75c08921-8f14-4ece-a027-a856149b46dc",
      creator: {
         forename: "Jean",
         surname: "Mendoza",
         username: "jmendoza"
      },
      created: "2014-02-18T18:37:09.000Z",
      modifier: {
         forename: "Tina",
         surname: "Kennedy",
         username: "tkennedy"
      },
      modified: "2015-07-05T03:28:09.000Z"
   }, {
      title: "Government Grants Register",
      nodeRef: "workspace:\/\/SpacesStore\/e3af89d0-b893-4721-9fd6-b7042458c4d7",
      creator: {
         forename: "Brenda",
         surname: "Sanchez",
         username: "bsanchez"
      },
      created: "2013-12-21T11:13:44.000Z",
      modifier: {
         forename: "Dennis",
         surname: "James",
         username: "djames"
      },
      modified: "2015-08-11T21:51:25.000Z"
   }, {
      title: "Hinckley and Bosworth",
      nodeRef: "workspace:\/\/SpacesStore\/967638d6-8aa7-47d2-b1e4-71869fe02952",
      creator: {
         forename: "Jeremy",
         surname: "Weaver",
         username: "jweaver"
      },
      created: "2014-01-24T07:06:58.000Z",
      modifier: {
         forename: "Judy",
         surname: "Arnold",
         username: "jarnold"
      },
      modified: "2015-07-16T11:40:01.000Z"
   }, {
      title: "Senior staff pay",
      nodeRef: "workspace:\/\/SpacesStore\/b298b869-0f56-4e04-b38b-12f869f06b87",
      creator: {
         forename: "Patrick",
         surname: "Bryant",
         username: "pbryant"
      },
      created: "2013-10-14T12:22:53.000Z",
      modifier: {
         forename: "Judy",
         surname: "Alexander",
         username: "jalexander"
      },
      modified: "2015-07-31T09:59:24.000Z"
   }, {
      title: "Education terms explanatory information",
      nodeRef: "workspace:\/\/SpacesStore\/2477a4d9-3f11-4f71-9a9c-c421e32da126",
      creator: {
         forename: "Debra",
         surname: "Cox",
         username: "dcox"
      },
      created: "2014-03-19T01:45:38.000Z",
      modifier: {
         forename: "Denise",
         surname: "Ellis",
         username: "dellis"
      },
      modified: "2015-06-15T04:25:37.000Z"
   }, {
      title: "Contract finder",
      nodeRef: "workspace:\/\/SpacesStore\/53d0ef98-db69-4a09-bfef-2cb729b0dc06",
      creator: {
         forename: "Virginia",
         surname: "Warren",
         username: "vwarren"
      },
      created: "2014-04-18T23:09:21.000Z",
      modifier: {
         forename: "Patrick",
         surname: "Mendoza",
         username: "pmendoza"
      },
      modified: "2015-03-10T02:22:47.000Z"
   }, {
      title: "Public spending control",
      nodeRef: "workspace:\/\/SpacesStore\/7e2723d1-f89c-4065-8250-4992c03f9e77",
      creator: {
         forename: "Pamela",
         surname: "Johnston",
         username: "pjohnston"
      },
      created: "2013-09-30T02:25:22.000Z",
      modifier: {
         forename: "Louis",
         surname: "Brown",
         username: "lbrown"
      },
      modified: "2015-01-28T21:59:39.000Z"
   }, {
      title: "Epsom and Ewell",
      nodeRef: "workspace:\/\/SpacesStore\/fec92347-2167-4441-9c81-0676fdff67b1",
      creator: {
         forename: "Ruby",
         surname: "Mccoy",
         username: "rmccoy"
      },
      created: "2014-02-01T07:56:19.000Z",
      modifier: {
         forename: "Janet",
         surname: "Carroll",
         username: "jcarroll"
      },
      modified: "2015-01-05T02:10:00.000Z"
   }, {
      title: "Criteria for publication",
      nodeRef: "workspace:\/\/SpacesStore\/19c0e135-2f4f-4fde-ba57-0ef13e46ffde",
      creator: {
         forename: "Karen",
         surname: "Wallace",
         username: "kwallace"
      },
      created: "2014-03-09T05:57:08.000Z",
      modifier: {
         forename: "Louise",
         surname: "Gonzalez",
         username: "lgonzalez"
      },
      modified: "2014-09-18T01:17:56.000Z"
   }, {
      title: "Junior staff",
      nodeRef: "workspace:\/\/SpacesStore\/2cd49858-427c-429a-866a-f5c6c6084d8d",
      creator: {
         forename: "Bruce",
         surname: "Smith",
         username: "bsmith"
      },
      created: "2014-06-15T05:11:12.000Z",
      modifier: {
         forename: "Stephen",
         surname: "Adams",
         username: "sadams"
      },
      modified: "2014-08-26T07:18:39.000Z"
   }, {
      title: "Car park parking fines",
      nodeRef: "workspace:\/\/SpacesStore\/f1cfc2bc-d754-422c-9f48-6addc91cf957",
      creator: {
         forename: "Joe",
         surname: "Ray",
         username: "jray"
      },
      created: "2014-04-18T12:43:10.000Z",
      modifier: {
         forename: "Nicole",
         surname: "Reynolds",
         username: "nreynolds"
      },
      modified: "2015-03-06T22:29:34.000Z"
   }, {
      title: "Senior officials hospitality",
      nodeRef: "workspace:\/\/SpacesStore\/71e0f909-5778-4270-8e32-895b089b5f56",
      creator: {
         forename: "Pamela",
         surname: "Bell",
         username: "pbell"
      },
      created: "2014-04-30T04:15:02.000Z",
      modifier: {
         forename: "Randy",
         surname: "Ellis",
         username: "rellis"
      },
      modified: "2015-03-01T08:24:27.000Z"
   }, {
      title: "Prevalence risks",
      nodeRef: "workspace:\/\/SpacesStore\/32d78a0b-6616-4f04-8ab4-d8c3285b5602",
      creator: {
         forename: "Jerry",
         surname: "Peters",
         username: "jpeters"
      },
      created: "2014-04-04T09:19:29.000Z",
      modifier: {
         forename: "Ruth",
         surname: "Spencer",
         username: "rspencer"
      },
      modified: "2015-04-03T01:04:19.000Z"
   }, {
      title: "St Edmundsbury",
      nodeRef: "workspace:\/\/SpacesStore\/1e19347a-cf66-4761-ac8e-25386ce0196d",
      creator: {
         forename: "Aaron",
         surname: "Black",
         username: "ablack"
      },
      created: "2013-10-06T22:28:21.000Z",
      modifier: {
         forename: "Jonathan",
         surname: "Jacobs",
         username: "jjacobs"
      },
      modified: "2015-07-03T17:09:44.000Z"
   }, {
      title: "Optical Headquarters",
      nodeRef: "workspace:\/\/SpacesStore\/b51d9ca8-bf63-477a-b9aa-905d71b72db6",
      creator: {
         forename: "Donald",
         surname: "Burns",
         username: "dburns"
      },
      created: "2013-10-26T02:48:39.000Z",
      modifier: {
         forename: "Andrew",
         surname: "Sanchez",
         username: "asanchez"
      },
      modified: "2015-08-11T10:34:47.000Z"
   }, {
      title: "Related resource",
      nodeRef: "workspace:\/\/SpacesStore\/5a7a608a-fef1-4251-a970-3a69bac32387",
      creator: {
         forename: "Keith",
         surname: "Garrett",
         username: "kgarrett"
      },
      created: "2013-11-02T05:31:56.000Z",
      modifier: {
         forename: "Karen",
         surname: "Garrett",
         username: "kgarrett"
      },
      modified: "2014-08-21T12:49:09.000Z"
   }, {
      title: "Collections database",
      nodeRef: "workspace:\/\/SpacesStore\/307b7b85-b773-4d2e-8c47-f61e4e5a5fb2",
      creator: {
         forename: "Phyllis",
         surname: "Willis",
         username: "pwillis"
      },
      created: "2014-02-14T09:09:58.000Z",
      modifier: {
         forename: "Timothy",
         surname: "Montgomery",
         username: "tmontgomery"
      },
      modified: "2014-10-20T02:29:51.000Z"
   }, {
      title: "Rother District Council Supplier Spend",
      nodeRef: "workspace:\/\/SpacesStore\/cca89a07-9d8b-4ffd-9bae-892526a8c1f0",
      creator: {
         forename: "Brian",
         surname: "Howell",
         username: "bhowell"
      },
      created: "2013-10-29T05:46:04.000Z",
      modifier: {
         forename: "Julie",
         surname: "Phillips",
         username: "jphillips"
      },
      modified: "2015-07-03T08:32:25.000Z"
   }, {
      title: "Ethnicity Success Rates",
      nodeRef: "workspace:\/\/SpacesStore\/3d6e6ee9-f910-4639-858d-b114824c229b",
      creator: {
         forename: "Earl",
         surname: "Palmer",
         username: "epalmer"
      },
      created: "2013-10-24T18:20:02.000Z",
      modifier: {
         forename: "Peter",
         surname: "Morris",
         username: "pmorris"
      },
      modified: "2014-10-15T18:26:51.000Z"
   }, {
      title: "Key performance indicators",
      nodeRef: "workspace:\/\/SpacesStore\/0aa46dc1-80c7-435d-baf1-4f3604338bb9",
      creator: {
         forename: "Amy",
         surname: "Bowman",
         username: "abowman"
      },
      created: "2014-01-10T19:02:58.000Z",
      modifier: {
         forename: "Jane",
         surname: "Reed",
         username: "jreed"
      },
      modified: "2015-05-27T18:03:19.000Z"
   }, {
      title: "CORE supporting tables",
      nodeRef: "workspace:\/\/SpacesStore\/48c8cd1b-8fb8-40b6-b5a4-c08a2ccaaad3",
      creator: {
         forename: "Matthew",
         surname: "Johnson",
         username: "mjohnson"
      },
      created: "2013-12-29T17:39:13.000Z",
      modifier: {
         forename: "Timothy",
         surname: "Ross",
         username: "tross"
      },
      modified: "2014-12-18T06:53:42.000Z"
   }, {
      title: "Museums events",
      nodeRef: "workspace:\/\/SpacesStore\/6274930b-f3dc-4e03-a0a6-9dc1639e2eab",
      creator: {
         forename: "Walter",
         surname: "Rose",
         username: "wrose"
      },
      created: "2013-09-11T19:21:14.000Z",
      modifier: {
         forename: "Maria",
         surname: "Stone",
         username: "mstone"
      },
      modified: "2015-07-03T10:34:29.000Z"
   }, {
      title: "Dataset counts as CSV",
      nodeRef: "workspace:\/\/SpacesStore\/d5b2f38f-a210-455b-9ab3-03cf6f8d8271",
      creator: {
         forename: "Ryan",
         surname: "Cole",
         username: "rcole"
      },
      created: "2013-12-29T17:39:25.000Z",
      modifier: {
         forename: "Michael",
         surname: "Hill",
         username: "mhill"
      },
      modified: "2014-10-18T15:37:00.000Z"
   }, {
      title: "Vacant Dwellings",
      nodeRef: "workspace:\/\/SpacesStore\/b25e8875-fb99-4dcc-8f5e-d86def37e42c",
      creator: {
         forename: "Henry",
         surname: "Martin",
         username: "hmartin"
      },
      created: "2014-07-23T07:47:47.000Z",
      modifier: {
         forename: "Gerald",
         surname: "Warren",
         username: "gwarren"
      },
      modified: "2015-04-18T02:32:25.000Z"
   }, {
      title: "Planning applications",
      nodeRef: "workspace:\/\/SpacesStore\/d241007d-994c-454c-a01f-455ed897958b",
      creator: {
         forename: "Susan",
         surname: "Harris",
         username: "sharris"
      },
      created: "2013-11-03T19:45:18.000Z",
      modifier: {
         forename: "Katherine",
         surname: "Owens",
         username: "kowens"
      },
      modified: "2015-02-16T04:41:46.000Z"
   }, {
      title: "IDOX Applications Environment Details",
      nodeRef: "workspace:\/\/SpacesStore\/dba565cb-5e47-46c1-bc15-059598309b1a",
      creator: {
         forename: "Catherine",
         surname: "Fuller",
         username: "cfuller"
      },
      created: "2014-03-11T02:24:26.000Z",
      modifier: {
         forename: "Angela",
         surname: "Daniels",
         username: "adaniels"
      },
      modified: "2014-12-09T12:02:33.000Z"
   }, {
      title: "Bolton Main Report",
      nodeRef: "workspace:\/\/SpacesStore\/7ce6a625-de42-4cd1-8b42-5e73687ff225",
      creator: {
         forename: "William",
         surname: "Jenkins",
         username: "wjenkins"
      },
      created: "2014-06-24T19:54:51.000Z",
      modifier: {
         forename: "Peter",
         surname: "Perez",
         username: "pperez"
      },
      modified: "2015-01-03T19:25:40.000Z"
   }, {
      title: "South Ayrshire",
      nodeRef: "workspace:\/\/SpacesStore\/0b6b6bbd-6e64-4c18-91a2-1687752352c7",
      creator: {
         forename: "Craig",
         surname: "Henderson",
         username: "chenderson"
      },
      created: "2014-04-03T10:02:20.000Z",
      modifier: {
         forename: "Marilyn",
         surname: "Bennett",
         username: "mbennett"
      },
      modified: "2014-12-10T20:47:18.000Z"
   }, {
      title: "Age Length Level Percentiles",
      nodeRef: "workspace:\/\/SpacesStore\/e0142e3d-b6cc-418c-96d5-bff0575a0751",
      creator: {
         forename: "Nicholas",
         surname: "Hunt",
         username: "nhunt"
      },
      created: "2014-03-31T09:50:21.000Z",
      modifier: {
         forename: "Clarence",
         surname: "Murray",
         username: "cmurray"
      },
      modified: "2015-02-20T05:38:43.000Z"
   }, {
      title: "Online Visualisation Tool",
      nodeRef: "workspace:\/\/SpacesStore\/bb97a104-9807-4537-91e1-5f103b33b816",
      creator: {
         forename: "Kathleen",
         surname: "Cunningham",
         username: "kcunningham"
      },
      created: "2014-07-26T22:00:44.000Z",
      modifier: {
         forename: "Maria",
         surname: "Young",
         username: "myoung"
      },
      modified: "2015-04-28T14:34:19.000Z"
   }, {
      title: "South Tyneside",
      nodeRef: "workspace:\/\/SpacesStore\/2762df66-1c19-4cd0-861b-1666d37bd46c",
      creator: {
         forename: "Albert",
         surname: "Reid",
         username: "areid"
      },
      created: "2014-05-22T16:08:05.000Z",
      modifier: {
         forename: "Raymond",
         surname: "Rose",
         username: "rrose"
      },
      modified: "2015-08-17T13:11:23.000Z"
   }, {
      title: "Explore the ASCOF data",
      nodeRef: "workspace:\/\/SpacesStore\/4a1343df-83d3-4b4d-9662-ace3d55da683",
      creator: {
         forename: "Janice",
         surname: "Burton",
         username: "jburton"
      },
      created: "2014-01-13T00:50:38.000Z",
      modifier: {
         forename: "Bruce",
         surname: "Richards",
         username: "brichards"
      },
      modified: "2015-07-26T11:20:57.000Z"
   }, {
      title: "Course directory API",
      nodeRef: "workspace:\/\/SpacesStore\/2b888ce5-f2af-4b1c-886a-b7d1554c881e",
      creator: {
         forename: "Brian",
         surname: "Henry",
         username: "bhenry"
      },
      created: "2014-02-27T14:58:41.000Z",
      modifier: {
         forename: "Lori",
         surname: "Day",
         username: "lday"
      },
      modified: "2014-09-06T14:00:25.000Z"
   }, {
      title: "Other Qualification Success Rates",
      nodeRef: "workspace:\/\/SpacesStore\/63fe07d4-d186-4f03-b18b-a28a48ba68c2",
      creator: {
         forename: "Aaron",
         surname: "Hart",
         username: "ahart"
      },
      created: "2013-11-24T13:17:47.000Z",
      modifier: {
         forename: "Martha",
         surname: "Morris",
         username: "mmorris"
      },
      modified: "2015-04-06T12:34:19.000Z"
   }, {
      title: "North Devon",
      nodeRef: "workspace:\/\/SpacesStore\/e3f42f42-0f64-49c9-b6cf-c565fc8856b0",
      creator: {
         forename: "Wanda",
         surname: "Nguyen",
         username: "wnguyen"
      },
      created: "2014-05-27T21:20:37.000Z",
      modifier: {
         forename: "Donald",
         surname: "Sanders",
         username: "dsanders"
      },
      modified: "2015-06-18T01:34:26.000Z"
   }, {
      title: "HPI Land Registry",
      nodeRef: "workspace:\/\/SpacesStore\/75d4e7ef-9665-466f-a4d7-ba309f70d847",
      creator: {
         forename: "Roy",
         surname: "Richardson",
         username: "rrichardson"
      },
      created: "2013-08-23T12:49:54.000Z",
      modifier: {
         forename: "Ruth",
         surname: "Clark",
         username: "rclark"
      },
      modified: "2015-01-05T23:08:09.000Z"
   }, {
      title: "Administrative budgets",
      nodeRef: "workspace:\/\/SpacesStore\/0f9c84bd-6f55-468b-9f7e-8afdf74eb1f0",
      creator: {
         forename: "Carol",
         surname: "Porter",
         username: "cporter"
      },
      created: "2014-05-11T09:03:41.000Z",
      modifier: {
         forename: "Joe",
         surname: "Freeman",
         username: "jfreeman"
      },
      modified: "2015-05-09T01:30:02.000Z"
   }, {
      title: "Junior Staff",
      nodeRef: "workspace:\/\/SpacesStore\/f38d6872-c844-4037-b11a-cda668d1abba",
      creator: {
         forename: "Susan",
         surname: "Carpenter",
         username: "scarpenter"
      },
      created: "2014-03-17T14:43:48.000Z",
      modifier: {
         forename: "Lois",
         surname: "Warren",
         username: "lwarren"
      },
      modified: "2015-07-14T03:17:53.000Z"
   }, {
      title: "General Ophthalmic Workforce Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/db77d3a9-4a60-47f6-9fc4-529df70cc678",
      creator: {
         forename: "Ann",
         surname: "Dixon",
         username: "adixon"
      },
      created: "2014-05-12T20:52:49.000Z",
      modifier: {
         forename: "Walter",
         surname: "Powell",
         username: "wpowell"
      },
      modified: "2014-12-14T16:55:45.000Z"
   }, {
      title: "Primary PCI",
      nodeRef: "workspace:\/\/SpacesStore\/62af923e-38c3-438c-82d1-8db145981806",
      creator: {
         forename: "Michelle",
         surname: "Butler",
         username: "mbutler"
      },
      created: "2014-07-02T11:39:43.000Z",
      modifier: {
         forename: "Willie",
         surname: "Griffin",
         username: "wgriffin"
      },
      modified: "2014-10-23T23:55:31.000Z"
   }, {
      title: "Development envelopes",
      nodeRef: "workspace:\/\/SpacesStore\/6d915a08-de30-4ff5-8fe9-03f6c3330c71",
      creator: {
         forename: "Louise",
         surname: "Wilson",
         username: "lwilson"
      },
      created: "2014-05-03T00:39:00.000Z",
      modifier: {
         forename: "Julie",
         surname: "Larson",
         username: "jlarson"
      },
      modified: "2014-11-05T00:40:02.000Z"
   }, {
      title: "Senior Staff Data",
      nodeRef: "workspace:\/\/SpacesStore\/b76ece5b-f5c9-4983-8d20-be22e0052915",
      creator: {
         forename: "Charles",
         surname: "Perkins",
         username: "cperkins"
      },
      created: "2014-03-27T14:13:01.000Z",
      modifier: {
         forename: "Shirley",
         surname: "Vasquez",
         username: "svasquez"
      },
      modified: "2014-10-06T08:47:07.000Z"
   }, {
      title: "Third data set",
      nodeRef: "workspace:\/\/SpacesStore\/4a2c0632-d2dc-4803-b77b-ec06d7a92dca",
      creator: {
         forename: "Joe",
         surname: "Sanchez",
         username: "jsanchez"
      },
      created: "2014-05-06T13:15:27.000Z",
      modifier: {
         forename: "Nicholas",
         surname: "Reyes",
         username: "nreyes"
      },
      modified: "2014-09-28T17:56:54.000Z"
   }, {
      title: "RBWM Corporate Strategy",
      nodeRef: "workspace:\/\/SpacesStore\/893545a7-85d3-4d6d-a35c-3c30f90fd226",
      creator: {
         forename: "Frances",
         surname: "Morgan",
         username: "fmorgan"
      },
      created: "2013-11-20T08:04:10.000Z",
      modifier: {
         forename: "Teresa",
         surname: "Rivera",
         username: "trivera"
      },
      modified: "2014-09-01T21:49:19.000Z"
   }, {
      title: "An INSPIRE View Service",
      nodeRef: "workspace:\/\/SpacesStore\/79b997e4-12c3-4df6-b105-6f121b72eabd",
      creator: {
         forename: "Patrick",
         surname: "Larson",
         username: "plarson"
      },
      created: "2014-05-10T07:40:17.000Z",
      modifier: {
         forename: "Shawn",
         surname: "Jacobs",
         username: "sjacobs"
      },
      modified: "2015-05-21T04:57:22.000Z"
   }, {
      title: "DSG Junior Staff Data",
      nodeRef: "workspace:\/\/SpacesStore\/53a988a4-eb32-4286-9052-7fe2bed5899d",
      creator: {
         forename: "Russell",
         surname: "Brown",
         username: "rbrown"
      },
      created: "2013-10-18T05:03:12.000Z",
      modifier: {
         forename: "Joyce",
         surname: "Baker",
         username: "jbaker"
      },
      modified: "2014-12-14T15:43:13.000Z"
   }, {
      title: "Open data directory",
      nodeRef: "workspace:\/\/SpacesStore\/fc6aa7a9-b7ad-4aae-944b-56ef8911ed8d",
      creator: {
         forename: "Brenda",
         surname: "Chapman",
         username: "bchapman"
      },
      created: "2014-05-28T07:32:38.000Z",
      modifier: {
         forename: "Margaret",
         surname: "Rogers",
         username: "mrogers"
      },
      modified: "2014-10-13T01:00:28.000Z"
   }, {
      title: "UDA by CCG",
      nodeRef: "workspace:\/\/SpacesStore\/027e1501-da6d-4a70-ae14-6dd4dd504668",
      creator: {
         forename: "Julie",
         surname: "Bryant",
         username: "jbryant"
      },
      created: "2014-04-09T08:53:58.000Z",
      modifier: {
         forename: "Kenneth",
         surname: "Mills",
         username: "kmills"
      },
      modified: "2014-11-22T13:04:54.000Z"
   }, {
      title: "Trade union facility time",
      nodeRef: "workspace:\/\/SpacesStore\/d60fd853-4a42-4f8a-be70-c1e5fbc80b0e",
      creator: {
         forename: "Lawrence",
         surname: "Garza",
         username: "lgarza"
      },
      created: "2014-05-15T12:07:04.000Z",
      modifier: {
         forename: "Raymond",
         surname: "Payne",
         username: "rpayne"
      },
      modified: "2014-11-21T05:02:50.000Z"
   }, {
      title: "GM Casualty Data",
      nodeRef: "workspace:\/\/SpacesStore\/d9da8b0f-c577-4473-8c16-fbace7d72ae5",
      creator: {
         forename: "Virginia",
         surname: "Snyder",
         username: "vsnyder"
      },
      created: "2014-01-14T16:21:55.000Z",
      modifier: {
         forename: "Ruby",
         surname: "Kennedy",
         username: "rkennedy"
      },
      modified: "2015-04-01T18:51:56.000Z"
   }, {
      title: "HSCIC Senior Staff Data",
      nodeRef: "workspace:\/\/SpacesStore\/ba5a16bb-ebab-4a28-9af8-cc505bb45437",
      creator: {
         forename: "Joyce",
         surname: "Porter",
         username: "jporter"
      },
      created: "2014-02-09T01:38:39.000Z",
      modifier: {
         forename: "Ronald",
         surname: "Nelson",
         username: "rnelson"
      },
      modified: "2015-03-08T08:56:46.000Z"
   }, {
      title: "NDDC Owned Land",
      nodeRef: "workspace:\/\/SpacesStore\/adae757e-13d2-48f9-bc2a-0a01a5972c16",
      creator: {
         forename: "Lois",
         surname: "Wood",
         username: "lwood"
      },
      created: "2014-04-06T00:59:40.000Z",
      modifier: {
         forename: "Lisa",
         surname: "Griffin",
         username: "lgriffin"
      },
      modified: "2014-10-03T02:50:45.000Z"
   }, {
      title: "OSCAR spending data spreadsheet",
      nodeRef: "workspace:\/\/SpacesStore\/bdc08e53-d5f0-4573-8b55-ec6bb0ff5d3b",
      creator: {
         forename: "Carolyn",
         surname: "Ellis",
         username: "cellis"
      },
      created: "2013-08-25T14:01:04.000Z",
      modifier: {
         forename: "Matthew",
         surname: "Reed",
         username: "mreed"
      },
      modified: "2015-05-26T04:40:38.000Z"
   }, {
      title: "Metrolink Station Facilities",
      nodeRef: "workspace:\/\/SpacesStore\/d8e14374-4974-4bd2-9d29-a83914e27dd8",
      creator: {
         forename: "Peter",
         surname: "Kelly",
         username: "pkelly"
      },
      created: "2013-09-09T03:46:08.000Z",
      modifier: {
         forename: "Jennifer",
         surname: "Larson",
         username: "jlarson"
      },
      modified: "2015-07-25T22:30:16.000Z"
   }, {
      title: "Departmental Organisational Charts",
      nodeRef: "workspace:\/\/SpacesStore\/8eaff8f5-d697-4cbb-a1ac-69facc016d35",
      creator: {
         forename: "Daniel",
         surname: "Welch",
         username: "dwelch"
      },
      created: "2014-06-19T22:17:45.000Z",
      modifier: {
         forename: "Kathy",
         surname: "Fowler",
         username: "kfowler"
      },
      modified: "2015-07-14T13:26:36.000Z"
   }, {
      title: "Car Leasehold",
      nodeRef: "workspace:\/\/SpacesStore\/1e691834-54b7-4522-ba35-5d3f2760a876",
      creator: {
         forename: "Peter",
         surname: "Griffin",
         username: "pgriffin"
      },
      created: "2014-08-02T20:15:48.000Z",
      modifier: {
         forename: "Annie",
         surname: "Hall",
         username: "ahall"
      },
      modified: "2015-06-26T12:24:46.000Z"
   }, {
      title: "Research report",
      nodeRef: "workspace:\/\/SpacesStore\/57f62542-72cf-445c-9100-6a49eafe0af9",
      creator: {
         forename: "Albert",
         surname: "Torres",
         username: "atorres"
      },
      created: "2013-12-07T13:46:27.000Z",
      modifier: {
         forename: "Jack",
         surname: "Tucker",
         username: "jtucker"
      },
      modified: "2015-01-06T23:19:08.000Z"
   }, {
      title: "Institution Gender Success Rates",
      nodeRef: "workspace:\/\/SpacesStore\/8bebc044-b9a8-4cd6-85ea-c7f659c40784",
      creator: {
         forename: "Wayne",
         surname: "Oliver",
         username: "woliver"
      },
      created: "2014-01-29T09:23:16.000Z",
      modifier: {
         forename: "Howard",
         surname: "Shaw",
         username: "hshaw"
      },
      modified: "2014-11-30T15:48:30.000Z"
   }, {
      title: "BNB Home Page",
      nodeRef: "workspace:\/\/SpacesStore\/f55bc64e-0489-4d29-9a6d-af2c5f0ed3c8",
      creator: {
         forename: "Gregory",
         surname: "Green",
         username: "ggreen"
      },
      created: "2014-08-01T14:24:37.000Z",
      modifier: {
         forename: "Sharon",
         surname: "Peters",
         username: "speters"
      },
      modified: "2015-01-01T11:52:15.000Z"
   }, {
      title: "Trafford Transport Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/1cf3062e-16e9-466e-ad8a-d4073becddff",
      creator: {
         forename: "Todd",
         surname: "Dunn",
         username: "tdunn"
      },
      created: "2013-12-14T22:57:26.000Z",
      modifier: {
         forename: "Martin",
         surname: "Nguyen",
         username: "mnguyen"
      },
      modified: "2015-08-08T19:13:08.000Z"
   }, {
      title: "Disciplinary cases by ethnicity",
      nodeRef: "workspace:\/\/SpacesStore\/c6a16092-6075-4802-aeea-d4bf7492428a",
      creator: {
         forename: "Shawn",
         surname: "Duncan",
         username: "sduncan"
      },
      created: "2013-12-23T01:01:27.000Z",
      modifier: {
         forename: "Randy",
         surname: "Ryan",
         username: "rryan"
      },
      modified: "2015-05-01T03:06:20.000Z"
   }, {
      title: "West Oxfordshire",
      nodeRef: "workspace:\/\/SpacesStore\/bce56051-418a-442f-9005-f18a277fb156",
      creator: {
         forename: "Alan",
         surname: "Garcia",
         username: "agarcia"
      },
      created: "2014-01-15T11:00:19.000Z",
      modifier: {
         forename: "Catherine",
         surname: "Taylor",
         username: "ctaylor"
      },
      modified: "2015-04-26T06:05:55.000Z"
   }, {
      title: "Programme expenditure",
      nodeRef: "workspace:\/\/SpacesStore\/380ac6a1-c6bc-48aa-b6d8-a6548a3a6fce",
      creator: {
         forename: "Jason",
         surname: "Matthews",
         username: "jmatthews"
      },
      created: "2014-08-06T08:43:11.000Z",
      modifier: {
         forename: "Richard",
         surname: "Schmidt",
         username: "rschmidt"
      },
      modified: "2014-09-02T22:20:53.000Z"
   }, {
      title: "National Adult Cardiac Surgery Audit",
      nodeRef: "workspace:\/\/SpacesStore\/7a5a2155-8ae4-4fa4-afff-9186aa177c90",
      creator: {
         forename: "Shawn",
         surname: "Cooper",
         username: "scooper"
      },
      created: "2014-05-14T01:01:54.000Z",
      modifier: {
         forename: "Ryan",
         surname: "Barnes",
         username: "rbarnes"
      },
      modified: "2015-01-18T10:32:46.000Z"
   }, {
      title: "List of Public Toilets",
      nodeRef: "workspace:\/\/SpacesStore\/5e14706b-d159-4f39-b4bc-9269287fe877",
      creator: {
         forename: "Norma",
         surname: "Ruiz",
         username: "nruiz"
      },
      created: "2013-09-23T23:45:21.000Z",
      modifier: {
         forename: "Amy",
         surname: "Jones",
         username: "ajones"
      },
      modified: "2014-11-24T23:17:21.000Z"
   }, {
      title: "Senior Officials hospitality",
      nodeRef: "workspace:\/\/SpacesStore\/3813c226-a42c-4036-a2f6-e7f7aaeae875",
      creator: {
         forename: "Shirley",
         surname: "Cruz",
         username: "scruz"
      },
      created: "2014-05-06T15:14:39.000Z",
      modifier: {
         forename: "Marie",
         surname: "Fowler",
         username: "mfowler"
      },
      modified: "2014-11-02T20:16:31.000Z"
   }, {
      title: "International tax benchmarking study",
      nodeRef: "workspace:\/\/SpacesStore\/c1d6f150-f5e6-4a8b-aee8-1bf50bbec82d",
      creator: {
         forename: "Daniel",
         surname: "Black",
         username: "dblack"
      },
      created: "2014-04-26T05:45:13.000Z",
      modifier: {
         forename: "Carl",
         surname: "Alexander",
         username: "calexander"
      },
      modified: "2015-06-11T09:38:52.000Z"
   }, {
      title: "EE mobile csv dataset",
      nodeRef: "workspace:\/\/SpacesStore\/1ffd7618-db11-42e8-9b98-2dc7d2163859",
      creator: {
         forename: "Kathryn",
         surname: "Hernandez",
         username: "khernandez"
      },
      created: "2013-11-19T12:39:36.000Z",
      modifier: {
         forename: "Karen",
         surname: "Olson",
         username: "kolson"
      },
      modified: "2014-12-15T10:58:40.000Z"
   }, {
      title: "Planning Applications Milton Keynes",
      nodeRef: "workspace:\/\/SpacesStore\/8f17db8d-044f-4b05-98ff-3b06ca8f0694",
      creator: {
         forename: "Melissa",
         surname: "Oliver",
         username: "moliver"
      },
      created: "2014-04-07T20:41:53.000Z",
      modifier: {
         forename: "Jessica",
         surname: "Powell",
         username: "jpowell"
      },
      modified: "2014-12-29T00:59:13.000Z"
   }, {
      title: "Playing Areas in York",
      nodeRef: "workspace:\/\/SpacesStore\/bd8994bc-431d-4db4-a9e4-2cd0351e81b3",
      creator: {
         forename: "Emily",
         surname: "Morris",
         username: "emorris"
      },
      created: "2014-03-03T17:02:40.000Z",
      modifier: {
         forename: "Jose",
         surname: "Johnston",
         username: "jjohnston"
      },
      modified: "2015-06-19T10:06:37.000Z"
   }, {
      title: "Appointments by gender",
      nodeRef: "workspace:\/\/SpacesStore\/37d01058-0375-44b7-9606-6e1a8bba2297",
      creator: {
         forename: "Henry",
         surname: "Kennedy",
         username: "hkennedy"
      },
      created: "2014-03-27T10:59:15.000Z",
      modifier: {
         forename: "Phillip",
         surname: "Anderson",
         username: "panderson"
      },
      modified: "2014-11-16T18:49:31.000Z"
   }, {
      title: "Full NJR Website",
      nodeRef: "workspace:\/\/SpacesStore\/c5ae624f-dea2-4bd9-a027-4cd8cbdefbe2",
      creator: {
         forename: "Douglas",
         surname: "Elliott",
         username: "delliott"
      },
      created: "2013-11-29T21:50:19.000Z",
      modifier: {
         forename: "Eugene",
         surname: "Carpenter",
         username: "ecarpenter"
      },
      modified: "2015-03-30T15:02:19.000Z"
   }, {
      title: "Glossary of terms",
      nodeRef: "workspace:\/\/SpacesStore\/1bc6b5b3-cc00-40a4-ae10-255d40c3a819",
      creator: {
         forename: "Peter",
         surname: "Rogers",
         username: "progers"
      },
      created: "2013-09-12T00:44:49.000Z",
      modifier: {
         forename: "Kenneth",
         surname: "Ford",
         username: "kford"
      },
      modified: "2014-08-21T06:44:45.000Z"
   }, {
      title: "North Lincolnshire",
      nodeRef: "workspace:\/\/SpacesStore\/aabecdf3-17a2-488e-974e-28f411d5f175",
      creator: {
         forename: "Wayne",
         surname: "Smith",
         username: "wsmith"
      },
      created: "2013-09-02T09:52:03.000Z",
      modifier: {
         forename: "Eugene",
         surname: "West",
         username: "ewest"
      },
      modified: "2014-11-02T09:17:27.000Z"
   }, {
      title: "Health sector",
      nodeRef: "workspace:\/\/SpacesStore\/cff029fa-cf52-4572-838a-03935dbfc720",
      creator: {
         forename: "Craig",
         surname: "Miller",
         username: "cmiller"
      },
      created: "2013-09-27T05:43:02.000Z",
      modifier: {
         forename: "David",
         surname: "Jenkins",
         username: "djenkins"
      },
      modified: "2014-12-18T05:08:15.000Z"
   }, {
      title: "Historic roadworks",
      nodeRef: "workspace:\/\/SpacesStore\/cce5a73a-2bd5-4a0b-bb4f-d031dc188840",
      creator: {
         forename: "Roy",
         surname: "Larson",
         username: "rlarson"
      },
      created: "2014-05-14T20:37:59.000Z",
      modifier: {
         forename: "Norma",
         surname: "Torres",
         username: "ntorres"
      },
      modified: "2015-05-12T23:19:18.000Z"
   }, {
      title: "Entire English dataset",
      nodeRef: "workspace:\/\/SpacesStore\/7f2f0c25-404f-4f82-ae87-a3378234a3d1",
      creator: {
         forename: "Andrew",
         surname: "Austin",
         username: "aaustin"
      },
      created: "2014-05-04T14:15:56.000Z",
      modifier: {
         forename: "Russell",
         surname: "Moreno",
         username: "rmoreno"
      },
      modified: "2014-12-03T04:10:31.000Z"
   }, {
      title: "Object Title",
      nodeRef: "workspace:\/\/SpacesStore\/01a7b0a7-a343-484b-8c3d-9693ccbb318f",
      creator: {
         forename: "Frances",
         surname: "Medina",
         username: "fmedina"
      },
      created: "2013-09-15T19:08:28.000Z",
      modifier: {
         forename: "Andrea",
         surname: "Bailey",
         username: "abailey"
      },
      modified: "2015-06-23T22:27:55.000Z"
   }, {
      title: "Parking",
      nodeRef: "workspace:\/\/SpacesStore\/20454edc-65ad-426a-8499-2ae463bccba8",
      creator: {
         forename: "Sara",
         surname: "Washington",
         username: "swashington"
      },
      created: "2014-08-12T14:24:30.000Z",
      modifier: {
         forename: "Roy",
         surname: "Garza",
         username: "rgarza"
      },
      modified: "2015-08-06T23:54:23.000Z"
   }, {
      title: "Schools Northumberland",
      nodeRef: "workspace:\/\/SpacesStore\/a840a0f6-ea8e-44df-865f-110baf290ea3",
      creator: {
         forename: "Angela",
         surname: "Bishop",
         username: "abishop"
      },
      created: "2014-08-16T17:00:06.000Z",
      modifier: {
         forename: "Terry",
         surname: "Matthews",
         username: "tmatthews"
      },
      modified: "2015-03-20T09:06:38.000Z"
   }, {
      title: "Dataset definitions",
      nodeRef: "workspace:\/\/SpacesStore\/8618b6ab-d578-4329-9776-bee1299b3956",
      creator: {
         forename: "Rachel",
         surname: "Watson",
         username: "rwatson"
      },
      created: "2013-09-07T04:56:07.000Z",
      modifier: {
         forename: "Justin",
         surname: "Reynolds",
         username: "jreynolds"
      },
      modified: "2015-04-27T18:48:27.000Z"
   }, {
      title: "Link to Contracts Finder",
      nodeRef: "workspace:\/\/SpacesStore\/6cdc3c42-5548-421f-97ae-91f6f633d2fb",
      creator: {
         forename: "Sarah",
         surname: "Rogers",
         username: "srogers"
      },
      created: "2013-08-25T09:02:52.000Z",
      modifier: {
         forename: "Robert",
         surname: "Harvey",
         username: "rharvey"
      },
      modified: "2014-10-08T14:33:19.000Z"
   }, {
      title: "Cambridge City",
      nodeRef: "workspace:\/\/SpacesStore\/d92291eb-da38-42f4-a30a-a4dc387840d9",
      creator: {
         forename: "Tina",
         surname: "Hicks",
         username: "thicks"
      },
      created: "2013-10-15T22:34:42.000Z",
      modifier: {
         forename: "Lisa",
         surname: "Nguyen",
         username: "lnguyen"
      },
      modified: "2014-11-09T00:28:30.000Z"
   }, {
      title: "Senior staff salaries",
      nodeRef: "workspace:\/\/SpacesStore\/0554be38-2172-46a6-8372-7bc73d2c1f2a",
      creator: {
         forename: "Doris",
         surname: "Spencer",
         username: "dspencer"
      },
      created: "2013-12-27T17:55:44.000Z",
      modifier: {
         forename: "Nicholas",
         surname: "Scott",
         username: "nscott"
      },
      modified: "2015-04-12T21:39:05.000Z"
   }, {
      title: "Counter Fraud Work",
      nodeRef: "workspace:\/\/SpacesStore\/4d3cdfdc-e689-42bb-babf-db83ebe326dc",
      creator: {
         forename: "Eugene",
         surname: "Anderson",
         username: "eanderson"
      },
      created: "2014-02-22T10:54:18.000Z",
      modifier: {
         forename: "Tammy",
         surname: "Chapman",
         username: "tchapman"
      },
      modified: "2014-10-08T02:01:16.000Z"
   }, {
      title: "Leavers by sexual orientation",
      nodeRef: "workspace:\/\/SpacesStore\/f45c4787-b782-435e-877f-18562f63be4e",
      creator: {
         forename: "Keith",
         surname: "Bell",
         username: "kbell"
      },
      created: "2013-11-07T22:13:14.000Z",
      modifier: {
         forename: "Nancy",
         surname: "Mitchell",
         username: "nmitchell"
      },
      modified: "2014-09-03T13:07:00.000Z"
   }, {
      title: "HM Treasury Electricity use",
      nodeRef: "workspace:\/\/SpacesStore\/d11016df-ffc5-4889-a4aa-ec5e750ed31f",
      creator: {
         forename: "Carl",
         surname: "West",
         username: "cwest"
      },
      created: "2014-01-30T13:33:18.000Z",
      modifier: {
         forename: "Joseph",
         surname: "Mendoza",
         username: "jmendoza"
      },
      modified: "2014-08-24T05:33:23.000Z"
   }, {
      title: "Exemption Data",
      nodeRef: "workspace:\/\/SpacesStore\/3c194954-d3e9-4a9e-b9cf-5ad5cda26e61",
      creator: {
         forename: "Anne",
         surname: "Medina",
         username: "amedina"
      },
      created: "2013-10-27T21:06:21.000Z",
      modifier: {
         forename: "Phillip",
         surname: "Murphy",
         username: "pmurphy"
      },
      modified: "2015-02-08T02:26:12.000Z"
   }, {
      title: "East Hampshire",
      nodeRef: "workspace:\/\/SpacesStore\/a2425539-a7a3-4c87-8dd9-bac3378ac2b0",
      creator: {
         forename: "Craig",
         surname: "Grant",
         username: "cgrant"
      },
      created: "2013-08-31T09:05:14.000Z",
      modifier: {
         forename: "Brian",
         surname: "Romero",
         username: "bromero"
      },
      modified: "2014-12-25T01:59:03.000Z"
   }, {
      title: "Commissioning Support Unit Sites",
      nodeRef: "workspace:\/\/SpacesStore\/2759cf56-868c-491f-808d-d7bc82ab4594",
      creator: {
         forename: "Denise",
         surname: "Wagner",
         username: "dwagner"
      },
      created: "2014-02-10T08:54:04.000Z",
      modifier: {
         forename: "Nicholas",
         surname: "Long",
         username: "nlong"
      },
      modified: "2014-10-14T12:51:52.000Z"
   }, {
      title: "Ward Boundaries Metadata",
      nodeRef: "workspace:\/\/SpacesStore\/8e81a934-d70e-41bd-9239-01ea2698c5fb",
      creator: {
         forename: "Louis",
         surname: "Kelly",
         username: "lkelly"
      },
      created: "2013-10-11T06:08:13.000Z",
      modifier: {
         forename: "Kathryn",
         surname: "Pierce",
         username: "kpierce"
      },
      modified: "2015-03-23T11:58:20.000Z"
   }, {
      title: "Exceptions to Recruitment Controls",
      nodeRef: "workspace:\/\/SpacesStore\/509b2b32-bbe7-4673-890b-ddb11a978526",
      creator: {
         forename: "Sharon",
         surname: "Gomez",
         username: "sgomez"
      },
      created: "2013-08-21T04:48:29.000Z",
      modifier: {
         forename: "Phyllis",
         surname: "Cox",
         username: "pcox"
      },
      modified: "2014-11-13T17:41:06.000Z"
   }, {
      title: "Field descriptions",
      nodeRef: "workspace:\/\/SpacesStore\/f5ad3cc2-35e3-442e-8651-1585973344cd",
      creator: {
         forename: "Sandra",
         surname: "Wright",
         username: "swright"
      },
      created: "2014-05-20T03:20:12.000Z",
      modifier: {
         forename: "Frances",
         surname: "Sanders",
         username: "fsanders"
      },
      modified: "2014-10-21T13:56:38.000Z"
   }, {
      title: "Lookup up tables for variables",
      nodeRef: "workspace:\/\/SpacesStore\/877c216f-c33b-4cf1-a50b-f278f8e02eb3",
      creator: {
         forename: "Gerald",
         surname: "Stanley",
         username: "gstanley"
      },
      created: "2013-09-01T01:29:24.000Z",
      modifier: {
         forename: "Jose",
         surname: "Davis",
         username: "jdavis"
      },
      modified: "2015-04-19T11:09:21.000Z"
   }, {
      title: "API tips",
      nodeRef: "workspace:\/\/SpacesStore\/ed994a47-2eb5-49e8-8c4f-7a3190c46c7d",
      creator: {
         forename: "Benjamin",
         surname: "Hicks",
         username: "bhicks"
      },
      created: "2014-07-20T21:32:53.000Z",
      modifier: {
         forename: "Elizabeth",
         surname: "Hughes",
         username: "ehughes"
      },
      modified: "2014-10-29T22:00:23.000Z"
   }, {
      title: "Data National Indicators",
      nodeRef: "workspace:\/\/SpacesStore\/f706cb03-d4a9-4813-93c0-eebe8cc9e759",
      creator: {
         forename: "Russell",
         surname: "Martinez",
         username: "rmartinez"
      },
      created: "2014-04-17T18:45:49.000Z",
      modifier: {
         forename: "Louise",
         surname: "Little",
         username: "llittle"
      },
      modified: "2014-08-27T20:07:15.000Z"
   }, {
      title: "Greater Manchester",
      nodeRef: "workspace:\/\/SpacesStore\/f2f2703a-0fd3-4661-9474-2d165aae4c22",
      creator: {
         forename: "Karen",
         surname: "Ford",
         username: "kford"
      },
      created: "2014-02-02T01:36:37.000Z",
      modifier: {
         forename: "Douglas",
         surname: "Diaz",
         username: "ddiaz"
      },
      modified: "2014-11-23T12:41:20.000Z"
   }, {
      title: "First data set",
      nodeRef: "workspace:\/\/SpacesStore\/5f5e18d8-9283-4ae6-b99d-05cd360e2c07",
      creator: {
         forename: "Karen",
         surname: "Martin",
         username: "kmartin"
      },
      created: "2013-10-16T16:46:46.000Z",
      modifier: {
         forename: "Victor",
         surname: "Nelson",
         username: "vnelson"
      },
      modified: "2015-05-03T12:39:02.000Z"
   }, {
      title: "Extent and trend tables",
      nodeRef: "workspace:\/\/SpacesStore\/fc28e039-29cf-42ac-92bb-3f01aef6417e",
      creator: {
         forename: "Donald",
         surname: "Wheeler",
         username: "dwheeler"
      },
      created: "2014-05-19T12:17:09.000Z",
      modifier: {
         forename: "Diana",
         surname: "Woods",
         username: "dwoods"
      },
      modified: "2015-07-17T21:29:20.000Z"
   }, {
      title: "Parks and gardens Metadata",
      nodeRef: "workspace:\/\/SpacesStore\/64f3e5b0-688f-4be7-8239-bbd679621bb4",
      creator: {
         forename: "Annie",
         surname: "Ferguson",
         username: "aferguson"
      },
      created: "2014-08-18T19:41:56.000Z",
      modifier: {
         forename: "Evelyn",
         surname: "Phillips",
         username: "ephillips"
      },
      modified: "2015-02-21T17:27:38.000Z"
   }, {
      title: "April Data",
      nodeRef: "workspace:\/\/SpacesStore\/64658975-90b0-4154-bc1c-379be4c5606f",
      creator: {
         forename: "Laura",
         surname: "Little",
         username: "llittle"
      },
      created: "2014-01-14T11:47:08.000Z",
      modifier: {
         forename: "Anna",
         surname: "Gardner",
         username: "agardner"
      },
      modified: "2014-09-25T06:09:54.000Z"
   }, {
      title: "UK Treaties Dataset",
      nodeRef: "workspace:\/\/SpacesStore\/bb99cd26-c969-47ff-8065-41b9461f6da0",
      creator: {
         forename: "Bobby",
         surname: "Dunn",
         username: "bdunn"
      },
      created: "2014-06-26T09:54:52.000Z",
      modifier: {
         forename: "Evelyn",
         surname: "Gonzales",
         username: "egonzales"
      },
      modified: "2014-08-25T11:21:16.000Z"
   }, {
      title: "Ethnicity information about candidates",
      nodeRef: "workspace:\/\/SpacesStore\/869a0235-eeb1-4ee7-9eed-762f51293a66",
      creator: {
         forename: "Carolyn",
         surname: "Gordon",
         username: "cgordon"
      },
      created: "2014-02-15T18:29:05.000Z",
      modifier: {
         forename: "Mark",
         surname: "Fields",
         username: "mfields"
      },
      modified: "2015-05-03T05:36:25.000Z"
   }, {
      title: "Planning Application",
      nodeRef: "workspace:\/\/SpacesStore\/053c3d4d-0b6e-42fe-ba5f-fa30110b60a5",
      creator: {
         forename: "Angela",
         surname: "Lee",
         username: "alee"
      },
      created: "2014-08-14T14:38:40.000Z",
      modifier: {
         forename: "Billy",
         surname: "Allen",
         username: "ballen"
      },
      modified: "2015-05-08T01:47:55.000Z"
   }, {
      title: "Contracts Archive website",
      nodeRef: "workspace:\/\/SpacesStore\/40ec2b0a-b136-4a19-a78c-0dad1bd919f7",
      creator: {
         forename: "Howard",
         surname: "Lane",
         username: "hlane"
      },
      created: "2013-12-03T01:35:27.000Z",
      modifier: {
         forename: "Jerry",
         surname: "Sanders",
         username: "jsanders"
      },
      modified: "2014-10-15T19:20:51.000Z"
   }, {
      title: "Car Parks data",
      nodeRef: "workspace:\/\/SpacesStore\/f50ac2af-c1fa-46cf-bfc0-78be7ed55e0e",
      creator: {
         forename: "Eugene",
         surname: "Harper",
         username: "eharper"
      },
      created: "2013-11-03T01:20:16.000Z",
      modifier: {
         forename: "Alan",
         surname: "Alvarez",
         username: "aalvarez"
      },
      modified: "2014-12-15T11:03:20.000Z"
   }, {
      title: "Tariff data",
      nodeRef: "workspace:\/\/SpacesStore\/0011271a-e766-4447-899a-bf092a5f583b",
      creator: {
         forename: "Julia",
         surname: "Garza",
         username: "jgarza"
      },
      created: "2013-10-22T02:12:21.000Z",
      modifier: {
         forename: "Stephanie",
         surname: "Walker",
         username: "swalker"
      },
      modified: "2015-02-08T13:24:05.000Z"
   }, {
      title: "SHMI Archive",
      nodeRef: "workspace:\/\/SpacesStore\/c561afaf-da7a-4d71-b807-5350924dea24",
      creator: {
         forename: "Willie",
         surname: "Olson",
         username: "wolson"
      },
      created: "2014-07-07T05:49:53.000Z",
      modifier: {
         forename: "Thomas",
         surname: "Knight",
         username: "tknight"
      },
      modified: "2015-06-10T17:08:33.000Z"
   }, {
      title: "CTLB Junior staff dataset",
      nodeRef: "workspace:\/\/SpacesStore\/023f3058-7a69-45fa-9a71-dcfc6facac5d",
      creator: {
         forename: "Benjamin",
         surname: "Romero",
         username: "bromero"
      },
      created: "2014-07-26T17:30:32.000Z",
      modifier: {
         forename: "Donald",
         surname: "Williamson",
         username: "dwilliamson"
      },
      modified: "2014-09-10T03:13:41.000Z"
   }, {
      title: "Flood Warning Areas",
      nodeRef: "workspace:\/\/SpacesStore\/35a75fba-0593-48d7-b18b-9b1e156d040d",
      creator: {
         forename: "Debra",
         surname: "Mccoy",
         username: "dmccoy"
      },
      created: "2013-08-25T05:48:56.000Z",
      modifier: {
         forename: "Aaron",
         surname: "Mendoza",
         username: "amendoza"
      },
      modified: "2014-09-10T15:52:29.000Z"
   }, {
      title: "Linked Open BNB Documentation",
      nodeRef: "workspace:\/\/SpacesStore\/1330fff5-be3f-4543-a86b-59c9fbccdfad",
      creator: {
         forename: "Ryan",
         surname: "Greene",
         username: "rgreene"
      },
      created: "2014-06-07T20:09:15.000Z",
      modifier: {
         forename: "Martin",
         surname: "Henry",
         username: "mhenry"
      },
      modified: "2015-05-08T17:02:53.000Z"
   }, {
      title: "Institution Ethnicity Success Rates",
      nodeRef: "workspace:\/\/SpacesStore\/14d28ec8-5d68-4c04-9900-9f834588772c",
      creator: {
         forename: "Matthew",
         surname: "Baker",
         username: "mbaker"
      },
      created: "2014-01-18T18:24:56.000Z",
      modifier: {
         forename: "Anna",
         surname: "Cooper",
         username: "acooper"
      },
      modified: "2015-01-27T08:37:43.000Z"
   }, {
      title: "Spotlight on Spend",
      nodeRef: "workspace:\/\/SpacesStore\/8e4e0ed6-fc40-4509-8f4c-3c0b92b74ddd",
      creator: {
         forename: "Judy",
         surname: "Murphy",
         username: "jmurphy"
      },
      created: "2014-01-29T22:36:28.000Z",
      modifier: {
         forename: "Andrew",
         surname: "Kelley",
         username: "akelley"
      },
      modified: "2014-08-25T19:20:26.000Z"
   }, {
      title: "Spending Approvals",
      nodeRef: "workspace:\/\/SpacesStore\/86ad888a-c5aa-4fe8-a779-ca7113643b85",
      creator: {
         forename: "Teresa",
         surname: "Henry",
         username: "thenry"
      },
      created: "2014-04-21T07:03:50.000Z",
      modifier: {
         forename: "Marilyn",
         surname: "Nguyen",
         username: "mnguyen"
      },
      modified: "2014-09-22T22:45:37.000Z"
   }, {
      title: "Provides information about senior posts",
      nodeRef: "workspace:\/\/SpacesStore\/853dcf6f-907a-444f-acd4-7ba5da01fd4c",
      creator: {
         forename: "Anna",
         surname: "Hall",
         username: "ahall"
      },
      created: "2013-10-30T05:40:06.000Z",
      modifier: {
         forename: "Carolyn",
         surname: "Rose",
         username: "crose"
      },
      modified: "2015-06-25T06:58:28.000Z"
   }, {
      title: "Explanation of Data Headers",
      nodeRef: "workspace:\/\/SpacesStore\/3a48e660-48d8-4455-b186-ce19eca8aed3",
      creator: {
         forename: "Lillian",
         surname: "Dunn",
         username: "ldunn"
      },
      created: "2013-09-16T12:48:01.000Z",
      modifier: {
         forename: "Paula",
         surname: "Jenkins",
         username: "pjenkins"
      },
      modified: "2015-07-07T00:49:30.000Z"
   }, {
      title: "Spending Data",
      nodeRef: "workspace:\/\/SpacesStore\/e4b17f31-9aba-41ba-bde1-be86f47c98aa",
      creator: {
         forename: "Lawrence",
         surname: "Miller",
         username: "lmiller"
      },
      created: "2014-03-21T10:32:09.000Z",
      modifier: {
         forename: "Emily",
         surname: "Torres",
         username: "etorres"
      },
      modified: "2015-06-16T00:12:17.000Z"
   }, {
      title: "Small society lottery registrations",
      nodeRef: "workspace:\/\/SpacesStore\/7b61118d-b8e4-408a-8a55-fe17fcc9fc7c",
      creator: {
         forename: "Shirley",
         surname: "Nelson",
         username: "snelson"
      },
      created: "2013-11-05T07:48:53.000Z",
      modifier: {
         forename: "Jeremy",
         surname: "Schmidt",
         username: "jschmidt"
      },
      modified: "2015-05-09T22:54:39.000Z"
   }, {
      title: "Senior staff",
      nodeRef: "workspace:\/\/SpacesStore\/5eb9d0cd-4486-4a03-a21a-0a149413490b",
      creator: {
         forename: "Cynthia",
         surname: "Dixon",
         username: "cdixon"
      },
      created: "2014-05-04T08:38:02.000Z",
      modifier: {
         forename: "Keith",
         surname: "Roberts",
         username: "kroberts"
      },
      modified: "2015-03-21T04:00:40.000Z"
   }, {
      title: "Data description degree of improvement in delays",
      nodeRef: "workspace:\/\/SpacesStore\/9da1dda4-ba0f-4c54-8bfa-9081cdca3a91",
      creator: {
         forename: "Andrew",
         surname: "Hicks",
         username: "ahicks"
      },
      created: "2013-09-09T00:04:22.000Z",
      modifier: {
         forename: "Carol",
         surname: "Mason",
         username: "cmason"
      },
      modified: "2014-09-04T01:00:29.000Z"
   }, {
      title: "TfGM GTFS Files",
      nodeRef: "workspace:\/\/SpacesStore\/2f864a87-84f2-4bf9-88d0-efb07afa5a3a",
      creator: {
         forename: "Brandon",
         surname: "Bowman",
         username: "bbowman"
      },
      created: "2014-01-27T08:01:19.000Z",
      modifier: {
         forename: "Kathleen",
         surname: "Martin",
         username: "kmartin"
      },
      modified: "2015-03-21T03:45:49.000Z"
   }, {
      title: "CRB checks and convictions",
      nodeRef: "workspace:\/\/SpacesStore\/6c0bbc0e-8634-498c-8926-49bedf8a7f6c",
      creator: {
         forename: "Emily",
         surname: "Baker",
         username: "ebaker"
      },
      created: "2013-11-22T03:28:10.000Z",
      modifier: {
         forename: "David",
         surname: "Butler",
         username: "dbutler"
      },
      modified: "2015-04-25T14:45:49.000Z"
   }, {
      title: "Violent crime",
      nodeRef: "workspace:\/\/SpacesStore\/983d7f7f-d03b-4655-b409-a5117f4a02b0",
      creator: {
         forename: "Kathryn",
         surname: "Fields",
         username: "kfields"
      },
      created: "2013-12-13T12:12:38.000Z",
      modifier: {
         forename: "Norma",
         surname: "Mills",
         username: "nmills"
      },
      modified: "2015-04-30T04:39:07.000Z"
   }, {
      title: "Core fields",
      nodeRef: "workspace:\/\/SpacesStore\/32f0eab5-832a-4c2f-89f5-31edadc1416e",
      creator: {
         forename: "Andrew",
         surname: "Frazier",
         username: "afrazier"
      },
      created: "2013-11-24T23:58:04.000Z",
      modifier: {
         forename: "Thomas",
         surname: "Russell",
         username: "trussell"
      },
      modified: "2015-01-07T06:08:10.000Z"
   }, {
      title: "Schools Map",
      nodeRef: "workspace:\/\/SpacesStore\/d9e709b7-677b-4969-b003-d870d19cc964",
      creator: {
         forename: "Carlos",
         surname: "Ryan",
         username: "cryan"
      },
      created: "2013-12-21T01:45:09.000Z",
      modifier: {
         forename: "Diane",
         surname: "Moore",
         username: "dmoore"
      },
      modified: "2015-04-07T11:34:25.000Z"
   }, {
      title: "Technical report",
      nodeRef: "workspace:\/\/SpacesStore\/3668f7f4-df8f-4ece-ae64-8db09dbf92fa",
      creator: {
         forename: "Daniel",
         surname: "Jenkins",
         username: "djenkins"
      },
      created: "2014-08-15T04:15:40.000Z",
      modifier: {
         forename: "Walter",
         surname: "White",
         username: "wwhite"
      },
      modified: "2014-11-26T12:58:53.000Z"
   }, {
      title: "Ancient Monuments Metadata",
      nodeRef: "workspace:\/\/SpacesStore\/1439ef9f-52e0-402a-8ff5-a2e038ce759f",
      creator: {
         forename: "Laura",
         surname: "Wagner",
         username: "lwagner"
      },
      created: "2014-08-14T08:08:19.000Z",
      modifier: {
         forename: "Marilyn",
         surname: "Hicks",
         username: "mhicks"
      },
      modified: "2015-05-01T18:27:34.000Z"
   }, {
      title: "Premises licences",
      nodeRef: "workspace:\/\/SpacesStore\/d0a53a00-3331-4926-952c-060c04669b54",
      creator: {
         forename: "Carl",
         surname: "Warren",
         username: "cwarren"
      },
      created: "2014-07-31T06:25:30.000Z",
      modifier: {
         forename: "Paul",
         surname: "Hall",
         username: "phall"
      },
      modified: "2015-02-21T06:29:31.000Z"
   }, {
      title: "Senior staff data",
      nodeRef: "workspace:\/\/SpacesStore\/acbf9bfa-b6e2-480b-9aa3-c556d649ba91",
      creator: {
         forename: "Sarah",
         surname: "Hawkins",
         username: "shawkins"
      },
      created: "2014-01-16T04:30:17.000Z",
      modifier: {
         forename: "Jessica",
         surname: "Hughes",
         username: "jhughes"
      },
      modified: "2015-08-08T22:16:54.000Z"
   }, {
      title: "FE Data Library",
      nodeRef: "workspace:\/\/SpacesStore\/5930484b-e5a8-46d7-ad92-e2349f092619",
      creator: {
         forename: "Robin",
         surname: "Gibson",
         username: "rgibson"
      },
      created: "2014-06-03T06:19:21.000Z",
      modifier: {
         forename: "Jason",
         surname: "Green",
         username: "jgreen"
      },
      modified: "2015-02-26T11:42:48.000Z"
   }, {
      title: "Risk Factor data completeness",
      nodeRef: "workspace:\/\/SpacesStore\/56b695ce-e6f4-4951-8396-9195417d0f02",
      creator: {
         forename: "Rachel",
         surname: "Mcdonald",
         username: "rmcdonald"
      },
      created: "2014-05-30T05:38:54.000Z",
      modifier: {
         forename: "Wayne",
         surname: "Hicks",
         username: "whicks"
      },
      modified: "2014-08-23T00:17:20.000Z"
   }, {
      title: "Metroshuttle Vehicles",
      nodeRef: "workspace:\/\/SpacesStore\/3208d686-c016-4996-addf-6f1aa0086488",
      creator: {
         forename: "Rachel",
         surname: "Barnes",
         username: "rbarnes"
      },
      created: "2014-05-16T14:04:17.000Z",
      modifier: {
         forename: "Ruby",
         surname: "Pierce",
         username: "rpierce"
      },
      modified: "2015-05-04T17:24:39.000Z"
   }, {
      title: "Plant diversity",
      nodeRef: "workspace:\/\/SpacesStore\/9bb51c30-3ce0-4adf-8288-0598143b666a",
      creator: {
         forename: "Charles",
         surname: "Fernandez",
         username: "cfernandez"
      },
      created: "2014-07-29T16:00:58.000Z",
      modifier: {
         forename: "Bruce",
         surname: "Thomas",
         username: "bthomas"
      },
      modified: "2015-07-20T03:45:00.000Z"
   }, {
      title: "MPA Annual Report",
      nodeRef: "workspace:\/\/SpacesStore\/966f0111-4b11-4de2-a4e2-3cf49289cd4c",
      creator: {
         forename: "Kelly",
         surname: "Boyd",
         username: "kboyd"
      },
      created: "2014-02-06T17:00:28.000Z",
      modifier: {
         forename: "Charles",
         surname: "Gonzales",
         username: "cgonzales"
      },
      modified: "2015-08-10T05:26:45.000Z"
   }, {
      title: "CSV format",
      nodeRef: "workspace:\/\/SpacesStore\/69ffac17-81c2-4836-8c4a-1aa0d04dfb09",
      creator: {
         forename: "Ernest",
         surname: "Willis",
         username: "ewillis"
      },
      created: "2013-08-21T12:07:04.000Z",
      modifier: {
         forename: "Roger",
         surname: "Wilson",
         username: "rwilson"
      },
      modified: "2015-08-18T16:33:27.000Z"
   }, {
      title: "External appointments by religion",
      nodeRef: "workspace:\/\/SpacesStore\/e9b570c9-682e-4bbf-87db-4dd88d312462",
      creator: {
         forename: "Gary",
         surname: "Palmer",
         username: "gpalmer"
      },
      created: "2014-01-04T05:37:55.000Z",
      modifier: {
         forename: "Eugene",
         surname: "Fisher",
         username: "efisher"
      },
      modified: "2014-09-03T17:09:47.000Z"
   }, {
      title: "Bexley",
      nodeRef: "workspace:\/\/SpacesStore\/90dcb7c1-6f37-4990-b582-d9fb1a171ef5",
      creator: {
         forename: "Anne",
         surname: "Hunt",
         username: "ahunt"
      },
      created: "2014-07-08T20:39:50.000Z",
      modifier: {
         forename: "Amy",
         surname: "Fox",
         username: "afox"
      },
      modified: "2015-05-10T09:09:16.000Z"
   }, {
      title: "Procurement service delivery plan",
      nodeRef: "workspace:\/\/SpacesStore\/228aacfb-58cf-4428-8c65-067a6f5a488b",
      creator: {
         forename: "Aaron",
         surname: "Willis",
         username: "awillis"
      },
      created: "2014-04-25T18:12:06.000Z",
      modifier: {
         forename: "Kathleen",
         surname: "Tucker",
         username: "ktucker"
      },
      modified: "2015-04-04T08:11:28.000Z"
   }, {
      title: "Derby Maps Website",
      nodeRef: "workspace:\/\/SpacesStore\/fbf2b517-93b1-4084-b376-f160f9b1e69c",
      creator: {
         forename: "Patricia",
         surname: "Reed",
         username: "preed"
      },
      created: "2013-09-03T02:48:56.000Z",
      modifier: {
         forename: "Frances",
         surname: "Murphy",
         username: "fmurphy"
      },
      modified: "2014-08-24T16:17:04.000Z"
   }, {
      title: "Referrals to IAPT Services",
      nodeRef: "workspace:\/\/SpacesStore\/b86a4faf-1564-4206-9370-c7020bf1da6d",
      creator: {
         forename: "Robert",
         surname: "James",
         username: "rjames"
      },
      created: "2014-01-20T01:44:01.000Z",
      modifier: {
         forename: "Maria",
         surname: "Black",
         username: "mblack"
      },
      modified: "2015-07-11T02:07:03.000Z"
   }, {
      title: "Council Spending",
      nodeRef: "workspace:\/\/SpacesStore\/769ee6bd-72f5-4cfb-b851-8363e9daf9d9",
      creator: {
         forename: "Emily",
         surname: "Rodriguez",
         username: "erodriguez"
      },
      created: "2014-01-09T14:41:02.000Z",
      modifier: {
         forename: "Jean",
         surname: "Murphy",
         username: "jmurphy"
      },
      modified: "2014-12-05T02:31:01.000Z"
   }, {
      title: "Court finder web interface",
      nodeRef: "workspace:\/\/SpacesStore\/baf788a8-9d54-485b-b183-1a36d43e076c",
      creator: {
         forename: "Kathleen",
         surname: "Reynolds",
         username: "kreynolds"
      },
      created: "2013-10-30T00:03:39.000Z",
      modifier: {
         forename: "Raymond",
         surname: "Scott",
         username: "rscott"
      },
      modified: "2015-08-09T11:26:19.000Z"
   }, {
      title: "Grit bin locations",
      nodeRef: "workspace:\/\/SpacesStore\/c631d685-702a-474b-9a94-304b77da03c4",
      creator: {
         forename: "Katherine",
         surname: "Jones",
         username: "kjones"
      },
      created: "2013-09-05T01:19:15.000Z",
      modifier: {
         forename: "Adam",
         surname: "Nguyen",
         username: "anguyen"
      },
      modified: "2014-09-22T14:26:14.000Z"
   }, {
      title: "Ramsar Sites",
      nodeRef: "workspace:\/\/SpacesStore\/3a54a362-552a-401f-9d35-0b894da3b534",
      creator: {
         forename: "Anna",
         surname: "Sims",
         username: "asims"
      },
      created: "2013-09-08T16:19:36.000Z",
      modifier: {
         forename: "Christina",
         surname: "Nelson",
         username: "cnelson"
      },
      modified: "2015-02-17T15:35:41.000Z"
   }, {
      title: "West Dunbartonshire",
      nodeRef: "workspace:\/\/SpacesStore\/86d53b46-2b27-40e6-b756-05fac42111fd",
      creator: {
         forename: "Emily",
         surname: "Bowman",
         username: "ebowman"
      },
      created: "2014-04-20T03:26:24.000Z",
      modifier: {
         forename: "Frank",
         surname: "Ellis",
         username: "fellis"
      },
      modified: "2014-10-01T15:17:34.000Z"
   }, {
      title: "North Ayrshire",
      nodeRef: "workspace:\/\/SpacesStore\/9a4be7c0-6012-42d3-8ebd-7d0396b24deb",
      creator: {
         forename: "Phillip",
         surname: "Hernandez",
         username: "phernandez"
      },
      created: "2014-08-15T12:38:40.000Z",
      modifier: {
         forename: "Timothy",
         surname: "Sullivan",
         username: "tsullivan"
      },
      modified: "2015-08-15T10:26:45.000Z"
   }, {
      title: "Nature of burglary",
      nodeRef: "workspace:\/\/SpacesStore\/c3872da2-3330-4e39-b17c-d9f030aa16c9",
      creator: {
         forename: "Christopher",
         surname: "Stewart",
         username: "cstewart"
      },
      created: "2014-06-25T15:05:38.000Z",
      modifier: {
         forename: "Norma",
         surname: "Robinson",
         username: "nrobinson"
      },
      modified: "2015-06-16T11:36:54.000Z"
   }, {
      title: "Services list CSV",
      nodeRef: "workspace:\/\/SpacesStore\/4beb68c3-af70-403c-9fab-942311cd5d51",
      creator: {
         forename: "Julia",
         surname: "Brooks",
         username: "jbrooks"
      },
      created: "2014-03-15T18:04:14.000Z",
      modifier: {
         forename: "Judith",
         surname: "Stone",
         username: "jstone"
      },
      modified: "2014-11-20T15:15:50.000Z"
   }, {
      title: "HQIP NCAPOP website page",
      nodeRef: "workspace:\/\/SpacesStore\/7d2965f1-5597-4e54-9de7-fe0bbc339169",
      creator: {
         forename: "Henry",
         surname: "Morris",
         username: "hmorris"
      },
      created: "2014-03-15T21:05:12.000Z",
      modifier: {
         forename: "Eugene",
         surname: "Wright",
         username: "ewright"
      },
      modified: "2014-10-19T15:35:14.000Z"
   }, {
      title: "Trafford main report",
      nodeRef: "workspace:\/\/SpacesStore\/ed4ac8cd-d9f7-4ed6-9bce-3f0e849d13ef",
      creator: {
         forename: "Johnny",
         surname: "Hill",
         username: "jhill"
      },
      created: "2013-10-21T06:20:15.000Z",
      modifier: {
         forename: "Johnny",
         surname: "Morris",
         username: "jmorris"
      },
      modified: "2015-07-14T05:24:17.000Z"
   }, {
      title: "January QDS data",
      nodeRef: "workspace:\/\/SpacesStore\/01b85e33-00ef-402c-81a2-10d92e88e60b",
      creator: {
         forename: "Helen",
         surname: "Gray",
         username: "hgray"
      },
      created: "2014-07-11T21:56:00.000Z",
      modifier: {
         forename: "Phillip",
         surname: "Matthews",
         username: "pmatthews"
      },
      modified: "2014-08-29T19:57:43.000Z"
   }, {
      title: "Image copyright details",
      nodeRef: "workspace:\/\/SpacesStore\/d4ea8696-d0f7-48de-a032-6bb13696264f",
      creator: {
         forename: "Linda",
         surname: "Washington",
         username: "lwashington"
      },
      created: "2014-07-05T02:39:37.000Z",
      modifier: {
         forename: "Robert",
         surname: "Riley",
         username: "rriley"
      },
      modified: "2015-07-01T04:32:43.000Z"
   }, {
      title: "HBC Planning Applications",
      nodeRef: "workspace:\/\/SpacesStore\/e1f4aa57-cb4b-4a07-84f7-90da0f5dfecc",
      creator: {
         forename: "Chris",
         surname: "Hunt",
         username: "chunt"
      },
      created: "2013-10-26T23:44:01.000Z",
      modifier: {
         forename: "Tammy",
         surname: "Ray",
         username: "tray"
      },
      modified: "2015-05-22T07:03:52.000Z"
   }, {
      title: "Country level Bilateral results achieved",
      nodeRef: "workspace:\/\/SpacesStore\/ac32bab7-ccbb-4479-a04f-93f453a95a50",
      creator: {
         forename: "Amanda",
         surname: "Howell",
         username: "ahowell"
      },
      created: "2013-09-22T19:15:47.000Z",
      modifier: {
         forename: "Andrew",
         surname: "Lopez",
         username: "alopez"
      },
      modified: "2014-12-29T14:50:15.000Z"
   }, {
      title: "Bromley",
      nodeRef: "workspace:\/\/SpacesStore\/9619ca52-7855-4c04-a823-af3159d855b3",
      creator: {
         forename: "Bonnie",
         surname: "Weaver",
         username: "bweaver"
      },
      created: "2013-11-02T19:04:29.000Z",
      modifier: {
         forename: "Frances",
         surname: "Gardner",
         username: "fgardner"
      },
      modified: "2014-09-11T07:56:57.000Z"
   }, {
      title: "Personal licences",
      nodeRef: "workspace:\/\/SpacesStore\/490cb599-bf65-4616-a0ea-5239fbac21de",
      creator: {
         forename: "Peter",
         surname: "Lewis",
         username: "plewis"
      },
      created: "2013-09-24T01:37:50.000Z",
      modifier: {
         forename: "Anne",
         surname: "Miller",
         username: "amiller"
      },
      modified: "2015-04-04T10:15:09.000Z"
   }, {
      title: "Zipped XML format",
      nodeRef: "workspace:\/\/SpacesStore\/e033e500-7a1d-4038-9c8d-39c5b2fc0840",
      creator: {
         forename: "Clarence",
         surname: "Shaw",
         username: "cshaw"
      },
      created: "2013-11-28T21:06:42.000Z",
      modifier: {
         forename: "Anne",
         surname: "Rice",
         username: "arice"
      },
      modified: "2015-07-23T18:49:00.000Z"
   }, {
      title: "Blaby Parking Information",
      nodeRef: "workspace:\/\/SpacesStore\/a3c7f811-1a56-4818-9c57-fa9c59f8bbe4",
      creator: {
         forename: "Christina",
         surname: "Stevens",
         username: "cstevens"
      },
      created: "2014-04-23T17:10:32.000Z",
      modifier: {
         forename: "Edward",
         surname: "James",
         username: "ejames"
      },
      modified: "2015-03-10T19:50:33.000Z"
   }, {
      title: "Senior staff posts inc vacancies",
      nodeRef: "workspace:\/\/SpacesStore\/9cedc0b0-a2a9-40e8-a110-eba19f9d16a3",
      creator: {
         forename: "Joseph",
         surname: "Diaz",
         username: "jdiaz"
      },
      created: "2013-09-02T10:43:35.000Z",
      modifier: {
         forename: "Maria",
         surname: "Patterson",
         username: "mpatterson"
      },
      modified: "2014-09-16T20:53:21.000Z"
   }, {
      title: "Gloucester City",
      nodeRef: "workspace:\/\/SpacesStore\/0d33df4f-04cc-42a6-8741-a9919cd990af",
      creator: {
         forename: "Paula",
         surname: "Ryan",
         username: "pryan"
      },
      created: "2013-10-04T15:12:02.000Z",
      modifier: {
         forename: "Judy",
         surname: "Williamson",
         username: "jwilliamson"
      },
      modified: "2015-06-06T05:04:08.000Z"
   }, {
      title: "TOMPS Data page",
      nodeRef: "workspace:\/\/SpacesStore\/a8e5f925-ce7c-4c77-a087-d16fc6c73669",
      creator: {
         forename: "Raymond",
         surname: "Riley",
         username: "rriley"
      },
      created: "2013-10-30T15:45:04.000Z",
      modifier: {
         forename: "Dennis",
         surname: "West",
         username: "dwest"
      },
      modified: "2015-07-22T21:36:28.000Z"
   }, {
      title: "East Cambridgeshire",
      nodeRef: "workspace:\/\/SpacesStore\/aca98049-5f85-43b6-aa6f-6e613480fee8",
      creator: {
         forename: "Sean",
         surname: "Morgan",
         username: "smorgan"
      },
      created: "2013-09-24T20:38:17.000Z",
      modifier: {
         forename: "Theresa",
         surname: "Willis",
         username: "twillis"
      },
      modified: "2015-07-28T02:17:37.000Z"
   }, {
      title: "National Results",
      nodeRef: "workspace:\/\/SpacesStore\/8fae59e0-f1d6-4cb2-af23-a9120a5e9258",
      creator: {
         forename: "Phyllis",
         surname: "Hicks",
         username: "phicks"
      },
      created: "2013-12-06T22:05:21.000Z",
      modifier: {
         forename: "Lawrence",
         surname: "Murphy",
         username: "lmurphy"
      },
      modified: "2015-03-12T17:14:50.000Z"
   }, {
      title: "Tameside Transport Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/b5abd293-6f77-446d-902a-e2213a2f63c9",
      creator: {
         forename: "Ronald",
         surname: "Gonzalez",
         username: "rgonzalez"
      },
      created: "2014-08-16T05:24:14.000Z",
      modifier: {
         forename: "Mark",
         surname: "Morales",
         username: "mmorales"
      },
      modified: "2015-07-24T04:26:07.000Z"
   }, {
      title: "NHS IC Junior Staff Data",
      nodeRef: "workspace:\/\/SpacesStore\/7132da1b-077f-427d-a6c9-b51fed4d1f20",
      creator: {
         forename: "Ruth",
         surname: "Gordon",
         username: "rgordon"
      },
      created: "2013-11-10T06:03:58.000Z",
      modifier: {
         forename: "Carol",
         surname: "Nguyen",
         username: "cnguyen"
      },
      modified: "2015-03-14T15:36:47.000Z"
   }, {
      title: "MVDC Contracts Register",
      nodeRef: "workspace:\/\/SpacesStore\/7a62659b-1d64-463b-a4ee-1c45a12b4c07",
      creator: {
         forename: "Shirley",
         surname: "Ramirez",
         username: "sramirez"
      },
      created: "2014-02-06T05:38:20.000Z",
      modifier: {
         forename: "Steve",
         surname: "Black",
         username: "sblack"
      },
      modified: "2014-08-24T11:30:58.000Z"
   }, {
      title: "Briefing Paper",
      nodeRef: "workspace:\/\/SpacesStore\/3f9f74d7-ea7e-4f96-82ea-84e95bdda35a",
      creator: {
         forename: "Denise",
         surname: "Cruz",
         username: "dcruz"
      },
      created: "2014-07-26T16:15:25.000Z",
      modifier: {
         forename: "Sara",
         surname: "Hughes",
         username: "shughes"
      },
      modified: "2015-07-08T18:58:36.000Z"
   }, {
      title: "Pay muliples",
      nodeRef: "workspace:\/\/SpacesStore\/26826806-3133-46aa-952d-53a70431ccc7",
      creator: {
         forename: "Jennifer",
         surname: "Kelly",
         username: "jkelly"
      },
      created: "2014-05-17T03:44:32.000Z",
      modifier: {
         forename: "Roy",
         surname: "Kelley",
         username: "rkelley"
      },
      modified: "2015-02-12T06:55:36.000Z"
   }, {
      title: "Aylesbury Vale",
      nodeRef: "workspace:\/\/SpacesStore\/429b30eb-2374-4d73-a98b-d2bc65d1927c",
      creator: {
         forename: "Patrick",
         surname: "Burns",
         username: "pburns"
      },
      created: "2014-08-14T12:46:31.000Z",
      modifier: {
         forename: "Gerald",
         surname: "Perez",
         username: "gperez"
      },
      modified: "2015-04-18T09:19:39.000Z"
   }, {
      title: "Background Quality Report",
      nodeRef: "workspace:\/\/SpacesStore\/e6608517-3b27-4df6-9336-7c7a1bfc9f6a",
      creator: {
         forename: "Kimberly",
         surname: "Hicks",
         username: "khicks"
      },
      created: "2014-05-08T10:19:51.000Z",
      modifier: {
         forename: "Tina",
         surname: "Marshall",
         username: "tmarshall"
      },
      modified: "2014-12-18T20:27:52.000Z"
   }, {
      title: "Public toilets in Tamworth",
      nodeRef: "workspace:\/\/SpacesStore\/9bfed39c-0c36-4f62-b2f2-98ed40f9af97",
      creator: {
         forename: "Jessica",
         surname: "Harris",
         username: "jharris"
      },
      created: "2014-04-26T05:52:08.000Z",
      modifier: {
         forename: "Marie",
         surname: "Alvarez",
         username: "malvarez"
      },
      modified: "2015-03-07T14:18:00.000Z"
   }, {
      title: "Prescription Cost Analysis",
      nodeRef: "workspace:\/\/SpacesStore\/745863d4-d4f3-49c2-92a1-8dcad29523c1",
      creator: {
         forename: "Gloria",
         surname: "Franklin",
         username: "gfranklin"
      },
      created: "2014-03-02T16:13:48.000Z",
      modifier: {
         forename: "Carlos",
         surname: "Nichols",
         username: "cnichols"
      },
      modified: "2014-11-12T19:06:16.000Z"
   }, {
      title: "Full contract and schedules",
      nodeRef: "workspace:\/\/SpacesStore\/fbccf65e-584c-4c00-b82f-5e0b7ab51680",
      creator: {
         forename: "Timothy",
         surname: "Miller",
         username: "tmiller"
      },
      created: "2013-12-06T18:41:02.000Z",
      modifier: {
         forename: "Janet",
         surname: "Hansen",
         username: "jhansen"
      },
      modified: "2015-05-26T19:49:03.000Z"
   }, {
      title: "Directgov Article Ratings",
      nodeRef: "workspace:\/\/SpacesStore\/525e7897-f030-487e-aa73-4f09dec6be08",
      creator: {
         forename: "Irene",
         surname: "Gomez",
         username: "igomez"
      },
      created: "2014-06-03T10:19:18.000Z",
      modifier: {
         forename: "Kathryn",
         surname: "Montgomery",
         username: "kmontgomery"
      },
      modified: "2015-06-20T04:05:59.000Z"
   }, {
      title: "UK Read Codes",
      nodeRef: "workspace:\/\/SpacesStore\/96cf560d-d35e-48e5-b016-ee2f8acfbb2b",
      creator: {
         forename: "Ruby",
         surname: "Simmons",
         username: "rsimmons"
      },
      created: "2014-02-12T18:03:38.000Z",
      modifier: {
         forename: "Julie",
         surname: "Schmidt",
         username: "jschmidt"
      },
      modified: "2015-08-08T19:07:45.000Z"
   }, {
      title: "January Annex data",
      nodeRef: "workspace:\/\/SpacesStore\/d0695f5a-535c-40fe-81a8-11e89e10ed66",
      creator: {
         forename: "Todd",
         surname: "Banks",
         username: "tbanks"
      },
      created: "2014-07-23T07:19:41.000Z",
      modifier: {
         forename: "Brandon",
         surname: "Johnson",
         username: "bjohnson"
      },
      modified: "2015-07-11T03:21:17.000Z"
   }, {
      title: "Met Office Salaries",
      nodeRef: "workspace:\/\/SpacesStore\/b6f61e70-c0a2-47cf-b4a9-9e18ed20cae9",
      creator: {
         forename: "Teresa",
         surname: "Moreno",
         username: "tmoreno"
      },
      created: "2014-04-25T16:58:29.000Z",
      modifier: {
         forename: "Betty",
         surname: "Henderson",
         username: "bhenderson"
      },
      modified: "2014-09-25T08:33:23.000Z"
   }, {
      title: "Survey results",
      nodeRef: "workspace:\/\/SpacesStore\/3b8d970a-5320-486b-bea2-aa82dc702712",
      creator: {
         forename: "Andrew",
         surname: "Sanchez",
         username: "asanchez"
      },
      created: "2014-07-03T12:44:28.000Z",
      modifier: {
         forename: "Joyce",
         surname: "Burton",
         username: "jburton"
      },
      modified: "2015-04-19T14:04:00.000Z"
   }, {
      title: "Long term museum loans",
      nodeRef: "workspace:\/\/SpacesStore\/3c713368-ae35-4632-8878-e250227a179d",
      creator: {
         forename: "Mildred",
         surname: "Lopez",
         username: "mlopez"
      },
      created: "2013-09-18T20:45:25.000Z",
      modifier: {
         forename: "Lisa",
         surname: "Garza",
         username: "lgarza"
      },
      modified: "2015-04-20T22:06:10.000Z"
   }, {
      title: "Land Use Change Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/744850ea-aa43-4e0b-98bf-85cf7c8c5d76",
      creator: {
         forename: "Cheryl",
         surname: "Walker",
         username: "cwalker"
      },
      created: "2014-08-16T04:51:13.000Z",
      modifier: {
         forename: "Debra",
         surname: "Davis",
         username: "ddavis"
      },
      modified: "2015-08-06T09:29:16.000Z"
   }, {
      title: "Cycle Parking",
      nodeRef: "workspace:\/\/SpacesStore\/0e5b8555-1f03-4d79-8912-66b5358078a9",
      creator: {
         forename: "Sandra",
         surname: "Long",
         username: "slong"
      },
      created: "2013-11-30T16:32:55.000Z",
      modifier: {
         forename: "Sara",
         surname: "Reed",
         username: "sreed"
      },
      modified: "2014-09-03T07:33:44.000Z"
   }, {
      title: "May QDS data",
      nodeRef: "workspace:\/\/SpacesStore\/b3569420-93a7-46ad-a23f-d40df96f0b75",
      creator: {
         forename: "Nicole",
         surname: "Reed",
         username: "nreed"
      },
      created: "2014-06-08T04:28:40.000Z",
      modifier: {
         forename: "Mark",
         surname: "Jacobs",
         username: "mjacobs"
      },
      modified: "2015-08-14T15:17:47.000Z"
   }, {
      title: "BPSS home page",
      nodeRef: "workspace:\/\/SpacesStore\/a1428cb1-d664-4f70-856e-bb3d6ce6f569",
      creator: {
         forename: "Christine",
         surname: "Crawford",
         username: "ccrawford"
      },
      created: "2014-08-16T15:30:15.000Z",
      modifier: {
         forename: "Sharon",
         surname: "Clark",
         username: "sclark"
      },
      modified: "2014-12-22T23:49:53.000Z"
   }, {
      title: "HSCIC Lifestyles Data",
      nodeRef: "workspace:\/\/SpacesStore\/8e3bc845-b90d-47cc-a97d-a78ec1bd5905",
      creator: {
         forename: "Beverly",
         surname: "Carter",
         username: "bcarter"
      },
      created: "2014-03-16T21:50:57.000Z",
      modifier: {
         forename: "Bobby",
         surname: "Hill",
         username: "bhill"
      },
      modified: "2015-01-19T16:00:10.000Z"
   }, {
      title: "Isles of Scilly",
      nodeRef: "workspace:\/\/SpacesStore\/5424a1dc-d7fe-49be-b3e3-bb8965d5ce1e",
      creator: {
         forename: "Joe",
         surname: "Sanders",
         username: "jsanders"
      },
      created: "2014-02-10T11:44:22.000Z",
      modifier: {
         forename: "Lawrence",
         surname: "Ross",
         username: "lross"
      },
      modified: "2015-04-20T23:18:02.000Z"
   }, {
      title: "Business Rates web page",
      nodeRef: "workspace:\/\/SpacesStore\/bf407ab1-3bf6-4d84-9007-737dfd04804c",
      creator: {
         forename: "Keith",
         surname: "Mills",
         username: "kmills"
      },
      created: "2013-09-17T21:54:41.000Z",
      modifier: {
         forename: "Billy",
         surname: "Walker",
         username: "bwalker"
      },
      modified: "2015-07-03T02:43:48.000Z"
   }, {
      title: "General election",
      nodeRef: "workspace:\/\/SpacesStore\/d457a970-5ebd-4243-91a1-dccf2f02bc22",
      creator: {
         forename: "Angela",
         surname: "Murray",
         username: "amurray"
      },
      created: "2014-06-12T03:48:51.000Z",
      modifier: {
         forename: "Arthur",
         surname: "Warren",
         username: "awarren"
      },
      modified: "2014-10-14T01:29:23.000Z"
   }, {
      title: "March return",
      nodeRef: "workspace:\/\/SpacesStore\/0db3dca5-8792-4674-b8b6-5147836c4ecf",
      creator: {
         forename: "Joshua",
         surname: "Carroll",
         username: "jcarroll"
      },
      created: "2013-10-09T17:36:48.000Z",
      modifier: {
         forename: "Scott",
         surname: "Ford",
         username: "sford"
      },
      modified: "2014-11-07T21:07:56.000Z"
   }, {
      title: "Wigan Transport Statistics",
      nodeRef: "workspace:\/\/SpacesStore\/728344e5-28c5-4b93-804a-4208dd58d6d1",
      creator: {
         forename: "Craig",
         surname: "Daniels",
         username: "cdaniels"
      },
      created: "2014-07-07T07:49:38.000Z",
      modifier: {
         forename: "Joseph",
         surname: "Ward",
         username: "jward"
      },
      modified: "2014-11-02T23:24:48.000Z"
   }, {
      title: "Multiple spreadsheets",
      nodeRef: "workspace:\/\/SpacesStore\/1caed6f1-cd80-4b5d-838e-01966874d847",
      creator: {
         forename: "Alice",
         surname: "Morris",
         username: "amorris"
      },
      created: "2014-06-03T00:34:30.000Z",
      modifier: {
         forename: "Gloria",
         surname: "Lawrence",
         username: "glawrence"
      },
      modified: "2015-04-24T09:10:51.000Z"
   }, {
      title: "User guide",
      nodeRef: "workspace:\/\/SpacesStore\/12802902-b844-46c2-9e10-b762d337c249",
      creator: {
         forename: "Martin",
         surname: "Jordan",
         username: "mjordan"
      },
      created: "2014-04-12T18:48:31.000Z",
      modifier: {
         forename: "Harold",
         surname: "Snyder",
         username: "hsnyder"
      },
      modified: "2015-05-19T01:32:43.000Z"
   }, {
      title: "Fraud and forgery",
      nodeRef: "workspace:\/\/SpacesStore\/bf9aceb1-f577-4073-bfa6-8411068a1914",
      creator: {
         forename: "Jack",
         surname: "Harrison",
         username: "jharrison"
      },
      created: "2014-06-28T19:01:02.000Z",
      modifier: {
         forename: "Roy",
         surname: "Powell",
         username: "rpowell"
      },
      modified: "2015-05-28T04:48:19.000Z"
   }, {
      title: "Linked Open BNB Platform",
      nodeRef: "workspace:\/\/SpacesStore\/50a1b2d1-992d-4f41-94bc-acd4bf41ed4e",
      creator: {
         forename: "Nicholas",
         surname: "Burns",
         username: "nburns"
      },
      created: "2014-06-30T01:17:24.000Z",
      modifier: {
         forename: "Joan",
         surname: "Ellis",
         username: "jellis"
      },
      modified: "2015-04-19T15:28:27.000Z"
   }, {
      title: "ODA Summary",
      nodeRef: "workspace:\/\/SpacesStore\/8be5a3f6-6b00-41c7-974a-f8a33e320fe2",
      creator: {
         forename: "Jean",
         surname: "Morgan",
         username: "jmorgan"
      },
      created: "2014-04-25T23:12:04.000Z",
      modifier: {
         forename: "Todd",
         surname: "Sanders",
         username: "tsanders"
      },
      modified: "2015-04-19T05:08:05.000Z"
   }, {
      title: "Polling station locations",
      nodeRef: "workspace:\/\/SpacesStore\/613ea7d4-caef-444b-b3e7-ee26279f5930",
      creator: {
         forename: "Margaret",
         surname: "Peters",
         username: "mpeters"
      },
      created: "2014-05-06T15:54:21.000Z",
      modifier: {
         forename: "Jimmy",
         surname: "Gonzales",
         username: "jgonzales"
      },
      modified: "2015-07-08T13:18:55.000Z"
   }, {
      title: "Traffic Flow Data",
      nodeRef: "workspace:\/\/SpacesStore\/620822e6-1a3d-4b42-8a1f-290e4e24609b",
      creator: {
         forename: "Kelly",
         surname: "Larson",
         username: "klarson"
      },
      created: "2014-04-24T10:21:18.000Z",
      modifier: {
         forename: "Louise",
         surname: "Wagner",
         username: "lwagner"
      },
      modified: "2015-05-04T13:09:07.000Z"
   }, {
      title: "Government construction pipeline",
      nodeRef: "workspace:\/\/SpacesStore\/13aab9d5-58f9-4c65-a1a0-c0aa24ea04bd",
      creator: {
         forename: "Juan",
         surname: "Spencer",
         username: "jspencer"
      },
      created: "2014-08-13T14:23:50.000Z",
      modifier: {
         forename: "Juan",
         surname: "Gonzales",
         username: "jgonzales"
      },
      modified: "2015-05-08T18:06:17.000Z"
   }, {
      title: "West Somerset",
      nodeRef: "workspace:\/\/SpacesStore\/2ef7ee61-56aa-4251-b483-5972ea479615",
      creator: {
         forename: "Kenneth",
         surname: "Perez",
         username: "kperez"
      },
      created: "2014-02-06T07:20:14.000Z",
      modifier: {
         forename: "Marilyn",
         surname: "Turner",
         username: "mturner"
      },
      modified: "2015-01-14T13:51:55.000Z"
   }, {
      title: "Open Data Certificate",
      nodeRef: "workspace:\/\/SpacesStore\/66b649ef-3997-43cd-9e7c-8395a75d37e6",
      creator: {
         forename: "Todd",
         surname: "Rodriguez",
         username: "trodriguez"
      },
      created: "2014-04-22T04:58:53.000Z",
      modifier: {
         forename: "Howard",
         surname: "Fox",
         username: "hfox"
      },
      modified: "2015-03-11T16:08:30.000Z"
   }, {
      title: "Methodological Change Document",
      nodeRef: "workspace:\/\/SpacesStore\/9c1f9f0e-38f6-4187-8740-62805b8fc283",
      creator: {
         forename: "Johnny",
         surname: "Ruiz",
         username: "jruiz"
      },
      created: "2013-09-19T16:38:21.000Z",
      modifier: {
         forename: "Joyce",
         surname: "Adams",
         username: "jadams"
      },
      modified: "2014-09-11T18:39:36.000Z"
   }, {
      title: "Case record audit tool",
      nodeRef: "workspace:\/\/SpacesStore\/6b3cb746-aedf-40a2-8983-e47e7577873a",
      creator: {
         forename: "Willie",
         surname: "Dunn",
         username: "wdunn"
      },
      created: "2014-05-09T17:18:21.000Z",
      modifier: {
         forename: "Andrew",
         surname: "Arnold",
         username: "aarnold"
      },
      modified: "2014-11-28T01:24:49.000Z"
   }, {
      title: "Schools key contacts",
      nodeRef: "workspace:\/\/SpacesStore\/2e53b906-1ce2-4c91-be03-11ff483a6b03",
      creator: {
         forename: "Karen",
         surname: "Peterson",
         username: "kpeterson"
      },
      created: "2014-07-15T03:11:48.000Z",
      modifier: {
         forename: "Theresa",
         surname: "Mendoza",
         username: "tmendoza"
      },
      modified: "2014-10-28T10:24:47.000Z"
   }, {
      title: "Data",
      nodeRef: "workspace:\/\/SpacesStore\/c6347cbf-8ff3-40fb-86d3-368777e00eb0",
      creator: {
         forename: "Teresa",
         surname: "Ferguson",
         username: "tferguson"
      },
      created: "2014-08-06T18:33:15.000Z",
      modifier: {
         forename: "Julia",
         surname: "Elliott",
         username: "jelliott"
      },
      modified: "2015-03-23T00:48:07.000Z"
   }, {
      title: "Internal appointments by religion",
      nodeRef: "workspace:\/\/SpacesStore\/7f4a8d8c-7eab-465c-abdc-17ff9564d0c5",
      creator: {
         forename: "Todd",
         surname: "Mendoza",
         username: "tmendoza"
      },
      created: "2013-12-11T11:56:14.000Z",
      modifier: {
         forename: "Ann",
         surname: "Moreno",
         username: "amoreno"
      },
      modified: "2015-03-26T04:30:40.000Z"
   }, {
      title: "WFS service",
      nodeRef: "workspace:\/\/SpacesStore\/30f3598b-ca1b-4974-8999-ca93b48da2f5",
      creator: {
         forename: "William",
         surname: "Olson",
         username: "wolson"
      },
      created: "2013-12-11T08:36:20.000Z",
      modifier: {
         forename: "Bonnie",
         surname: "Austin",
         username: "baustin"
      },
      modified: "2014-10-08T04:12:58.000Z"
   }, {
      title: "CMR WAL telecoms data",
      nodeRef: "workspace:\/\/SpacesStore\/8efd5d33-71a5-4fb9-9eea-8ead49a4ac63",
      creator: {
         forename: "Amanda",
         surname: "Mendoza",
         username: "amendoza"
      },
      created: "2014-04-13T00:03:40.000Z",
      modifier: {
         forename: "Helen",
         surname: "Elliott",
         username: "helliott"
      },
      modified: "2015-07-13T15:29:32.000Z"
   }, {
      title: "East Lothian",
      nodeRef: "workspace:\/\/SpacesStore\/3390d737-f3d5-400d-9d0d-ec5d2a5632ed",
      creator: {
         forename: "Louis",
         surname: "Perez",
         username: "lperez"
      },
      created: "2014-03-24T09:53:21.000Z",
      modifier: {
         forename: "Roy",
         surname: "Alvarez",
         username: "ralvarez"
      },
      modified: "2015-04-15T15:51:41.000Z"
   }, {
      title: "Hillsborough Independent Panel Disclosure",
      nodeRef: "workspace:\/\/SpacesStore\/99ea167b-504a-44a4-bb5a-da2c64a24d34",
      creator: {
         forename: "Jesse",
         surname: "Garza",
         username: "jgarza"
      },
      created: "2014-01-21T18:49:49.000Z",
      modifier: {
         forename: "Andrea",
         surname: "Garrett",
         username: "agarrett"
      },
      modified: "2014-08-22T06:15:54.000Z"
   }, {
      title: "UK CMR internet data",
      nodeRef: "workspace:\/\/SpacesStore\/6c4988ba-24d7-4c22-b4a9-c6aea356d0da",
      creator: {
         forename: "Beverly",
         surname: "Thomas",
         username: "bthomas"
      },
      created: "2014-07-07T09:21:28.000Z",
      modifier: {
         forename: "Lori",
         surname: "Jackson",
         username: "ljackson"
      },
      modified: "2015-04-08T18:12:15.000Z"
   }, {
      title: "Contaminated Land",
      nodeRef: "workspace:\/\/SpacesStore\/84b8cba9-e68c-4ff0-8a19-4161a30b3763",
      creator: {
         forename: "Jeffrey",
         surname: "Lopez",
         username: "jlopez"
      },
      created: "2014-07-25T01:45:02.000Z",
      modifier: {
         forename: "Teresa",
         surname: "Richards",
         username: "trichards"
      },
      modified: "2015-07-28T22:04:40.000Z"
   }, {
      title: "Published Tender Documents",
      nodeRef: "workspace:\/\/SpacesStore\/4db49051-25ab-4687-a374-395e48c5b109",
      creator: {
         forename: "Kelly",
         surname: "Bell",
         username: "kbell"
      },
      created: "2014-05-19T18:13:50.000Z",
      modifier: {
         forename: "Antonio",
         surname: "Evans",
         username: "aevans"
      },
      modified: "2014-09-10T23:13:26.000Z"
   }, {
      title: "Vehicle related theft",
      nodeRef: "workspace:\/\/SpacesStore\/d00816da-2b56-4f78-b40f-81e10ac2a77f",
      creator: {
         forename: "Teresa",
         surname: "Davis",
         username: "tdavis"
      },
      created: "2014-01-07T06:25:58.000Z",
      modifier: {
         forename: "Patricia",
         surname: "Wilson",
         username: "pwilson"
      },
      modified: "2015-06-19T14:25:43.000Z"
   }, {
      title: "Leavers by age",
      nodeRef: "workspace:\/\/SpacesStore\/25f72e03-b273-4de5-9a4a-758577655816",
      creator: {
         forename: "Arthur",
         surname: "Collins",
         username: "acollins"
      },
      created: "2014-02-22T02:36:40.000Z",
      modifier: {
         forename: "Janet",
         surname: "Wright",
         username: "jwright"
      },
      modified: "2014-09-28T00:59:29.000Z"
   }, {
      title: "Firework licence holders",
      nodeRef: "workspace:\/\/SpacesStore\/fd8abfe0-bafa-4496-882a-158ce6353540",
      creator: {
         forename: "Catherine",
         surname: "Lawson",
         username: "clawson"
      },
      created: "2013-12-07T15:15:53.000Z",
      modifier: {
         forename: "Jerry",
         surname: "Berry",
         username: "jberry"
      },
      modified: "2015-05-30T21:01:20.000Z"
   }, {
      title: "Oldham Main Report",
      nodeRef: "workspace:\/\/SpacesStore\/3fa279b0-a9e0-4a00-8668-c5193bba4439",
      creator: {
         forename: "Dorothy",
         surname: "Richards",
         username: "drichards"
      },
      created: "2014-07-10T19:42:37.000Z",
      modifier: {
         forename: "Carolyn",
         surname: "Moore",
         username: "cmoore"
      },
      modified: "2014-11-03T12:40:03.000Z"
   }, {
      title: "June Data",
      nodeRef: "workspace:\/\/SpacesStore\/45205cb9-5452-442b-b83d-60509dd0f902",
      creator: {
         forename: "Gary",
         surname: "Hamilton",
         username: "ghamilton"
      },
      created: "2013-11-27T14:27:56.000Z",
      modifier: {
         forename: "Teresa",
         surname: "Thomas",
         username: "tthomas"
      },
      modified: "2014-11-17T14:25:54.000Z"
   }, {
      title: "Meetings with external media",
      nodeRef: "workspace:\/\/SpacesStore\/9d956e4b-5914-4fa1-a016-ce6e99188c6c",
      creator: {
         forename: "Martha",
         surname: "Brown",
         username: "mbrown"
      },
      created: "2013-11-30T19:37:56.000Z",
      modifier: {
         forename: "Judy",
         surname: "Cox",
         username: "jcox"
      },
      modified: "2015-05-23T13:54:06.000Z"
   }, {
      title: "Sexual offences",
      nodeRef: "workspace:\/\/SpacesStore\/8e07e77a-ae83-4c88-99d1-011b16a63090",
      creator: {
         forename: "Heather",
         surname: "Boyd",
         username: "hboyd"
      },
      created: "2013-11-21T17:11:36.000Z",
      modifier: {
         forename: "Margaret",
         surname: "Harrison",
         username: "mharrison"
      },
      modified: "2014-08-24T23:05:44.000Z"
   }, {
      title: "Police recorded crime data",
      nodeRef: "workspace:\/\/SpacesStore\/418af017-04c3-46dd-90f7-f142bb974a3d",
      creator: {
         forename: "Carl",
         surname: "Martinez",
         username: "cmartinez"
      },
      created: "2014-01-01T10:29:04.000Z",
      modifier: {
         forename: "Sarah",
         surname: "Sanders",
         username: "ssanders"
      },
      modified: "2015-04-13T23:32:44.000Z"
   }, {
      title: "Cambridge Public Toilets",
      nodeRef: "workspace:\/\/SpacesStore\/792c63f4-f85e-48d3-921a-ed23f42dbed3",
      creator: {
         forename: "Benjamin",
         surname: "Freeman",
         username: "bfreeman"
      },
      created: "2013-09-03T09:33:31.000Z",
      modifier: {
         forename: "Ernest",
         surname: "Porter",
         username: "eporter"
      },
      modified: "2015-05-25T06:11:25.000Z"
   }, {
      title: "HM Treasury",
      nodeRef: "workspace:\/\/SpacesStore\/58e8d165-a03f-4191-b8a5-8bf21a75754b",
      creator: {
         forename: "Brandon",
         surname: "Sims",
         username: "bsims"
      },
      created: "2014-07-14T13:00:26.000Z",
      modifier: {
         forename: "Sarah",
         surname: "Burton",
         username: "sburton"
      },
      modified: "2015-08-13T02:24:31.000Z"
   }, {
      title: "GPC Card Issuer Merchant Category Codes",
      nodeRef: "workspace:\/\/SpacesStore\/906e2924-0444-4060-8f0d-cca4fc32148b",
      creator: {
         forename: "Janice",
         surname: "Perkins",
         username: "jperkins"
      },
      created: "2014-02-11T07:49:35.000Z",
      modifier: {
         forename: "Steve",
         surname: "Romero",
         username: "sromero"
      },
      modified: "2014-10-14T14:18:30.000Z"
   }, {
      title: "NAM Organogram",
      nodeRef: "workspace:\/\/SpacesStore\/fef64c58-ef3d-4460-8487-dd61f8e95ba9",
      creator: {
         forename: "Steve",
         surname: "Carroll",
         username: "scarroll"
      },
      created: "2014-02-11T01:37:28.000Z",
      modifier: {
         forename: "Cynthia",
         surname: "Bell",
         username: "cbell"
      },
      modified: "2015-06-16T15:04:46.000Z"
   }, {
      title: "Archived data from DH",
      nodeRef: "workspace:\/\/SpacesStore\/04dd0ffd-d623-4327-9372-db8be40a8be4",
      creator: {
         forename: "Marilyn",
         surname: "Taylor",
         username: "mtaylor"
      },
      created: "2014-03-04T02:24:42.000Z",
      modifier: {
         forename: "Karen",
         surname: "Hansen",
         username: "khansen"
      },
      modified: "2014-12-27T17:17:30.000Z"
   }, {
      title: "Planning Applications Online",
      nodeRef: "workspace:\/\/SpacesStore\/3dd54230-2582-4bf6-9dc8-26c782e84540",
      creator: {
         forename: "Kathryn",
         surname: "Banks",
         username: "kbanks"
      },
      created: "2014-05-11T21:57:14.000Z",
      modifier: {
         forename: "Jose",
         surname: "Brooks",
         username: "jbrooks"
      },
      modified: "2015-05-30T03:59:33.000Z"
   }, {
      title: "Business Rates retention update",
      nodeRef: "workspace:\/\/SpacesStore\/f842f378-d16f-4c96-8279-f0e1cf0206c2",
      creator: {
         forename: "Emily",
         surname: "Jenkins",
         username: "ejenkins"
      },
      created: "2014-03-02T07:06:03.000Z",
      modifier: {
         forename: "Diana",
         surname: "Gonzalez",
         username: "dgonzalez"
      },
      modified: "2014-11-16T10:35:38.000Z"
   }, {
      title: "Public Toilet information",
      nodeRef: "workspace:\/\/SpacesStore\/53259c05-0acc-4e95-8a5e-feee6210c7bf",
      creator: {
         forename: "Jimmy",
         surname: "Porter",
         username: "jporter"
      },
      created: "2013-10-08T20:30:11.000Z",
      modifier: {
         forename: "Kelly",
         surname: "Murray",
         username: "kmurray"
      },
      modified: "2014-10-08T01:14:31.000Z"
   }, {
      title: "Directory of dumps",
      nodeRef: "workspace:\/\/SpacesStore\/c17a5743-79d9-4ca1-8ba9-22ce0ce9a43c",
      creator: {
         forename: "Robert",
         surname: "Ramirez",
         username: "rramirez"
      },
      created: "2014-01-03T09:51:04.000Z",
      modifier: {
         forename: "Shawn",
         surname: "Garcia",
         username: "sgarcia"
      },
      modified: "2014-09-21T12:42:13.000Z"
   }, {
      title: "Link to data",
      nodeRef: "workspace:\/\/SpacesStore\/d5cea4ca-2a0c-477a-8be2-a99b9693b258",
      creator: {
         forename: "Scott",
         surname: "Bell",
         username: "sbell"
      },
      created: "2014-02-01T20:17:58.000Z",
      modifier: {
         forename: "Justin",
         surname: "Brown",
         username: "jbrown"
      },
      modified: "2014-08-27T21:36:48.000Z"
   }, {
      title: "Appointments by age",
      nodeRef: "workspace:\/\/SpacesStore\/54602c9a-847e-4a5a-aebe-73c23f057ad6",
      creator: {
         forename: "Russell",
         surname: "Nichols",
         username: "rnichols"
      },
      created: "2014-02-22T12:31:23.000Z",
      modifier: {
         forename: "Tammy",
         surname: "Washington",
         username: "twashington"
      },
      modified: "2015-07-30T23:31:48.000Z"
   }, {
      title: "Metadata File",
      nodeRef: "workspace:\/\/SpacesStore\/4638ce70-8458-4f0d-8482-dcb5b401d2a2",
      creator: {
         forename: "Evelyn",
         surname: "Holmes",
         username: "eholmes"
      },
      created: "2014-06-26T09:33:28.000Z",
      modifier: {
         forename: "Adam",
         surname: "Edwards",
         username: "aedwards"
      },
      modified: "2014-12-20T06:44:56.000Z"
   }, {
      title: "NAEI emissions data selector",
      nodeRef: "workspace:\/\/SpacesStore\/a69663a0-84df-4654-9dde-94889fce111d",
      creator: {
         forename: "Henry",
         surname: "Jones",
         username: "hjones"
      },
      created: "2013-08-30T14:16:13.000Z",
      modifier: {
         forename: "Barbara",
         surname: "Peters",
         username: "bpeters"
      },
      modified: "2014-12-16T14:34:29.000Z"
   }, {
      title: "CERT reports home page",
      nodeRef: "workspace:\/\/SpacesStore\/530b7175-fa06-4967-ad9f-285927a6fb1b",
      creator: {
         forename: "Maria",
         surname: "Stone",
         username: "mstone"
      },
      created: "2014-06-29T00:01:23.000Z",
      modifier: {
         forename: "Clarence",
         surname: "Stone",
         username: "cstone"
      },
      modified: "2014-09-16T18:15:39.000Z"
   }, {
      title: "North Lanarkshire",
      nodeRef: "workspace:\/\/SpacesStore\/6e503efa-26a1-4e05-a30a-63163c888629",
      creator: {
         forename: "Carol",
         surname: "Howard",
         username: "choward"
      },
      created: "2014-03-24T21:51:12.000Z",
      modifier: {
         forename: "Ann",
         surname: "Kennedy",
         username: "akennedy"
      },
      modified: "2014-11-14T04:02:18.000Z"
   }, {
      title: "Credit Card Spend",
      nodeRef: "workspace:\/\/SpacesStore\/56994ba6-d0ff-4474-9413-4558a94e929c",
      creator: {
         forename: "Willie",
         surname: "Fox",
         username: "wfox"
      },
      created: "2014-07-27T22:14:36.000Z",
      modifier: {
         forename: "Michelle",
         surname: "Webb",
         username: "mwebb"
      },
      modified: "2014-11-21T20:30:33.000Z"
   }, {
      title: "SPARQL web form",
      nodeRef: "workspace:\/\/SpacesStore\/96b0c371-c7a8-4ee5-8c90-62070ab20c4f",
      creator: {
         forename: "Anthony",
         surname: "Alvarez",
         username: "aalvarez"
      },
      created: "2013-11-14T15:38:27.000Z",
      modifier: {
         forename: "Antonio",
         surname: "Gardner",
         username: "agardner"
      },
      modified: "2015-06-11T12:56:28.000Z"
   }, {
      title: "Indicator Generation Methodology",
      nodeRef: "workspace:\/\/SpacesStore\/677ca380-1805-4b5d-97af-a54ff9e02948",
      creator: {
         forename: "Paul",
         surname: "Thomas",
         username: "pthomas"
      },
      created: "2014-05-26T15:42:38.000Z",
      modifier: {
         forename: "Kathy",
         surname: "Hall",
         username: "khall"
      },
      modified: "2015-02-02T09:51:01.000Z"
   }, {
      title: "Transition service delivery plan",
      nodeRef: "workspace:\/\/SpacesStore\/4bc4f4ad-e306-4258-91d7-c4003b3e3ad3",
      creator: {
         forename: "Willie",
         surname: "Hudson",
         username: "whudson"
      },
      created: "2014-08-01T03:58:47.000Z",
      modifier: {
         forename: "Debra",
         surname: "Wilson",
         username: "dwilson"
      },
      modified: "2015-07-27T19:53:08.000Z"
   }, {
      title: "Chart of Accounts csv",
      nodeRef: "workspace:\/\/SpacesStore\/fe545f6b-d90e-4d7a-abdd-fdcd6bc323fd",
      creator: {
         forename: "George",
         surname: "Perry",
         username: "gperry"
      },
      created: "2014-03-05T03:01:46.000Z",
      modifier: {
         forename: "Laura",
         surname: "Alexander",
         username: "lalexander"
      },
      modified: "2015-04-14T05:36:05.000Z"
   }, {
      title: "Description of data and caveats associated with data",
      nodeRef: "workspace:\/\/SpacesStore\/5c5faa4e-cc2b-4112-8a0d-a63bd830cc9d",
      creator: {
         forename: "Linda",
         surname: "Fernandez",
         username: "lfernandez"
      },
      created: "2014-03-25T23:31:48.000Z",
      modifier: {
         forename: "Lawrence",
         surname: "Martinez",
         username: "lmartinez"
      },
      modified: "2015-01-17T12:13:06.000Z"
   }, {
      title: "Meusydd Parcio",
      nodeRef: "workspace:\/\/SpacesStore\/d5498dfd-80e7-4d82-879e-765bf65762a8",
      creator: {
         forename: "Christina",
         surname: "Jones",
         username: "cjones"
      },
      created: "2014-05-02T05:40:30.000Z",
      modifier: {
         forename: "Doris",
         surname: "Hill",
         username: "dhill"
      },
      modified: "2015-02-01T08:31:11.000Z"
   }, {
      title: "Senior salary report",
      nodeRef: "workspace:\/\/SpacesStore\/9644a621-a6e6-4717-91e0-9beced9e705f",
      creator: {
         forename: "Jerry",
         surname: "Ortiz",
         username: "jortiz"
      },
      created: "2014-05-08T20:49:48.000Z",
      modifier: {
         forename: "Kathy",
         surname: "Howard",
         username: "khoward"
      },
      modified: "2015-04-19T03:03:37.000Z"
   }, {
      title: "About the Safety Thermometer",
      nodeRef: "workspace:\/\/SpacesStore\/065464c9-a7c9-4e03-b9dd-73458da0a83b",
      creator: {
         forename: "Virginia",
         surname: "Richards",
         username: "vrichards"
      },
      created: "2014-05-01T19:35:37.000Z",
      modifier: {
         forename: "Henry",
         surname: "Bell",
         username: "hbell"
      },
      modified: "2015-04-01T00:39:22.000Z"
   }, {
      title: "Mental Health Bulletin",
      nodeRef: "workspace:\/\/SpacesStore\/07e483a8-dc76-4ebd-b5e5-4b377778a35a",
      creator: {
         forename: "George",
         surname: "Jacobs",
         username: "gjacobs"
      },
      created: "2014-07-06T21:08:03.000Z",
      modifier: {
         forename: "Judy",
         surname: "Welch",
         username: "jwelch"
      },
      modified: "2014-11-29T19:08:47.000Z"
   }, {
      title: "Castle Point",
      nodeRef: "workspace:\/\/SpacesStore\/a761f823-e9b3-4bc7-995f-fe49c942f45e",
      creator: {
         forename: "Robert",
         surname: "Ortiz",
         username: "rortiz"
      },
      created: "2013-09-17T14:32:55.000Z",
      modifier: {
         forename: "Joyce",
         surname: "Mcdonald",
         username: "jmcdonald"
      },
      modified: "2014-09-16T00:21:43.000Z"
   }, {
      title: "An INSPIRE Download Service",
      nodeRef: "workspace:\/\/SpacesStore\/819eba31-82b3-4b42-987b-ffff35676c03",
      creator: {
         forename: "Harry",
         surname: "Matthews",
         username: "hmatthews"
      },
      created: "2013-11-23T16:14:34.000Z",
      modifier: {
         forename: "Jerry",
         surname: "Cooper",
         username: "jcooper"
      },
      modified: "2015-02-01T18:14:31.000Z"
   }, {
      title: "SHMI Funnel Plots",
      nodeRef: "workspace:\/\/SpacesStore\/b44a4ab5-5020-432e-918e-c63de964f341",
      creator: {
         forename: "Pamela",
         surname: "Medina",
         username: "pmedina"
      },
      created: "2014-05-18T23:27:43.000Z",
      modifier: {
         forename: "Clarence",
         surname: "Roberts",
         username: "croberts"
      },
      modified: "2015-05-28T02:11:13.000Z"
   }, {
      title: "Data on HMB Symptoms",
      nodeRef: "workspace:\/\/SpacesStore\/3bd72785-d076-41ea-a36f-7b7d9508eca2",
      creator: {
         forename: "Sean",
         surname: "Watson",
         username: "swatson"
      },
      created: "2013-09-16T09:06:03.000Z",
      modifier: {
         forename: "Evelyn",
         surname: "George",
         username: "egeorge"
      },
      modified: "2015-01-07T04:35:59.000Z"
   }, {
      title: "Habitat Connectivity",
      nodeRef: "workspace:\/\/SpacesStore\/8c8023f2-acb5-46ad-b633-b4139d28859e",
      creator: {
         forename: "Jane",
         surname: "Fisher",
         username: "jfisher"
      },
      created: "2014-06-20T01:26:30.000Z",
      modifier: {
         forename: "Gloria",
         surname: "Dunn",
         username: "gdunn"
      },
      modified: "2014-12-25T23:15:23.000Z"
   }, {
      title: "CCTV policy",
      nodeRef: "workspace:\/\/SpacesStore\/178712d2-0d2f-464a-8701-2a37f052e7da",
      creator: {
         forename: "Emily",
         surname: "Ward",
         username: "eward"
      },
      created: "2014-05-27T15:11:58.000Z",
      modifier: {
         forename: "Julie",
         surname: "Williams",
         username: "jwilliams"
      },
      modified: "2015-02-20T01:58:28.000Z"
   }, {
      title: "Meetings with external organisations",
      nodeRef: "workspace:\/\/SpacesStore\/e216fd6e-83f2-45c5-8143-be24d57bcae8",
      creator: {
         forename: "Wayne",
         surname: "Harrison",
         username: "wharrison"
      },
      created: "2013-12-03T17:39:06.000Z",
      modifier: {
         forename: "Lois",
         surname: "Hunt",
         username: "lhunt"
      },
      modified: "2015-04-08T10:10:20.000Z"
   }, {
      title: "Community Infrastructure Levy",
      nodeRef: "workspace:\/\/SpacesStore\/c30bca3c-7712-4be7-b6da-8866eab8c273",
      creator: {
         forename: "Paula",
         surname: "Hunter",
         username: "phunter"
      },
      created: "2013-09-30T21:35:08.000Z",
      modifier: {
         forename: "Marilyn",
         surname: "Carr",
         username: "mcarr"
      },
      modified: "2015-01-06T12:57:20.000Z"
   }, {
      title: "Exeter City",
      nodeRef: "workspace:\/\/SpacesStore\/8c5d5319-d2da-486b-a387-d208537d40b3",
      creator: {
         forename: "Johnny",
         surname: "Ellis",
         username: "jellis"
      },
      created: "2014-07-19T05:40:34.000Z",
      modifier: {
         forename: "Billy",
         surname: "Butler",
         username: "bbutler"
      },
      modified: "2015-01-15T00:43:34.000Z"
   }, {
      title: "Huntingdonshire",
      nodeRef: "workspace:\/\/SpacesStore\/30eae8ee-8a5d-467a-a406-fe750e43d74a",
      creator: {
         forename: "Annie",
         surname: "Peters",
         username: "apeters"
      },
      created: "2014-04-03T11:25:20.000Z",
      modifier: {
         forename: "Tammy",
         surname: "Shaw",
         username: "tshaw"
      },
      modified: "2015-02-08T22:43:34.000Z"
   }, {
      title: "Fraud Document",
      nodeRef: "workspace:\/\/SpacesStore\/8a4bbf09-9afa-420d-b257-cc76d37bc1da",
      creator: {
         forename: "Christine",
         surname: "Montgomery",
         username: "cmontgomery"
      },
      created: "2014-03-12T08:45:50.000Z",
      modifier: {
         forename: "Scott",
         surname: "Murray",
         username: "smurray"
      },
      modified: "2015-05-03T09:37:27.000Z"
   }, {
      title: "SLDC Open data directory",
      nodeRef: "workspace:\/\/SpacesStore\/9bab9d5b-71b8-4096-985f-b8ce8de1f1a5",
      creator: {
         forename: "Randy",
         surname: "Ray",
         username: "rray"
      },
      created: "2014-06-02T18:03:21.000Z",
      modifier: {
         forename: "Matthew",
         surname: "Clark",
         username: "mclark"
      },
      modified: "2014-09-23T10:41:20.000Z"
   }, {
      title: "MOD tax arrangements",
      nodeRef: "workspace:\/\/SpacesStore\/9634032b-aaa1-4657-b33c-df9ab4825380",
      creator: {
         forename: "Lisa",
         surname: "Hansen",
         username: "lhansen"
      },
      created: "2014-01-23T22:27:31.000Z",
      modifier: {
         forename: "Howard",
         surname: "Grant",
         username: "hgrant"
      },
      modified: "2015-02-25T05:43:03.000Z"
   }, {
      title: "Superconnected cities broadband",
      nodeRef: "workspace:\/\/SpacesStore\/22fdad09-83c4-4b67-8fbd-ba7ddcbd1c1f",
      creator: {
         forename: "James",
         surname: "West",
         username: "jwest"
      },
      created: "2014-02-01T19:00:08.000Z",
      modifier: {
         forename: "Julia",
         surname: "George",
         username: "jgeorge"
      },
      modified: "2014-10-27T12:05:39.000Z"
   }, {
      title: "Windsor and Maidenhead",
      nodeRef: "workspace:\/\/SpacesStore\/417b9e92-39a5-4d81-8c36-14c3be293eda",
      creator: {
         forename: "Joan",
         surname: "Wheeler",
         username: "jwheeler"
      },
      created: "2014-03-28T20:51:55.000Z",
      modifier: {
         forename: "Frances",
         surname: "Wilson",
         username: "fwilson"
      },
      modified: "2015-08-12T17:04:44.000Z"
   }, {
      title: "Historic Flood Map",
      nodeRef: "workspace:\/\/SpacesStore\/2ea66ddb-7225-4b21-922b-4d3caa703229",
      creator: {
         forename: "Diana",
         surname: "Morrison",
         username: "dmorrison"
      },
      created: "2013-09-01T13:35:58.000Z",
      modifier: {
         forename: "Martin",
         surname: "Reed",
         username: "mreed"
      },
      modified: "2015-07-06T20:19:59.000Z"
   }, {
      title: "Exceptions to Recruitment Controls",
      nodeRef: "workspace:\/\/SpacesStore\/a6c6d10b-2322-4246-9ac7-3ad902341612",
      creator: {
         forename: "Lawrence",
         surname: "Taylor",
         username: "ltaylor"
      },
      created: "2014-04-13T15:58:50.000Z",
      modifier: {
         forename: "Debra",
         surname: "Knight",
         username: "dknight"
      },
      modified: "2015-02-02T07:20:30.000Z"
   }, {
      title: "UK CMR telecoms data",
      nodeRef: "workspace:\/\/SpacesStore\/76e97067-779c-4445-9525-ba493ebe2e01",
      creator: {
         forename: "Michelle",
         surname: "Gibson",
         username: "mgibson"
      },
      created: "2013-10-18T03:30:53.000Z",
      modifier: {
         forename: "Sean",
         surname: "Murphy",
         username: "smurphy"
      },
      modified: "2015-07-29T20:24:42.000Z"
   }, {
      title: "Primary School catchment areas",
      nodeRef: "workspace:\/\/SpacesStore\/0e2b05e6-7e5e-42d7-aa18-a47f5685e8f6",
      creator: {
         forename: "Randy",
         surname: "Knight",
         username: "rknight"
      },
      created: "2014-07-29T10:37:58.000Z",
      modifier: {
         forename: "Larry",
         surname: "Richardson",
         username: "lrichardson"
      },
      modified: "2015-08-15T00:13:21.000Z"
   }, {
      title: "February return",
      nodeRef: "workspace:\/\/SpacesStore\/8321722a-ddf1-4ef2-a86d-c0dda311e4a0",
      creator: {
         forename: "Robin",
         surname: "Warren",
         username: "rwarren"
      },
      created: "2014-05-25T06:04:40.000Z",
      modifier: {
         forename: "Christina",
         surname: "Harris",
         username: "charris"
      },
      modified: "2014-09-29T13:21:50.000Z"
   }, {
      title: "Manchester Main Report",
      nodeRef: "workspace:\/\/SpacesStore\/e8f98151-249d-4e90-985f-a1e82b3fc945",
      creator: {
         forename: "Chris",
         surname: "Sullivan",
         username: "csullivan"
      },
      created: "2013-11-11T23:03:15.000Z",
      modifier: {
         forename: "Sharon",
         surname: "Harvey",
         username: "sharvey"
      },
      modified: "2015-02-17T09:49:21.000Z"
   }, {
      title: "Hub Launchpad website",
      nodeRef: "workspace:\/\/SpacesStore\/6afb58b4-2899-4e84-8302-c90aef1dcfcf",
      creator: {
         forename: "Stephen",
         surname: "Harper",
         username: "sharper"
      },
      created: "2014-07-23T14:13:05.000Z",
      modifier: {
         forename: "Debra",
         surname: "Andrews",
         username: "dandrews"
      },
      modified: "2015-02-06T07:10:19.000Z"
   }, {
      title: "Image license details",
      nodeRef: "workspace:\/\/SpacesStore\/5a712eae-ef41-4bb7-b420-3ceba1c2d4ac",
      creator: {
         forename: "Johnny",
         surname: "Austin",
         username: "jaustin"
      },
      created: "2013-12-22T18:45:35.000Z",
      modifier: {
         forename: "Michael",
         surname: "Wilson",
         username: "mwilson"
      },
      modified: "2014-11-24T03:38:55.000Z"
   }, {
      title: "East Ayrshire",
      nodeRef: "workspace:\/\/SpacesStore\/c610046c-15f8-4f6c-be17-ee3469fb454e",
      creator: {
         forename: "Eric",
         surname: "Baker",
         username: "ebaker"
      },
      created: "2013-12-13T01:12:34.000Z",
      modifier: {
         forename: "Angela",
         surname: "Reynolds",
         username: "areynolds"
      },
      modified: "2015-07-17T14:06:48.000Z"
   }, {
      title: "Property Classifications by Parish",
      nodeRef: "workspace:\/\/SpacesStore\/ee32a673-72bb-411a-9921-8a30d8650da5",
      creator: {
         forename: "Frances",
         surname: "Frazier",
         username: "ffrazier"
      },
      created: "2014-07-14T14:39:42.000Z",
      modifier: {
         forename: "Shirley",
         surname: "Montgomery",
         username: "smontgomery"
      },
      modified: "2014-08-23T03:57:17.000Z"
   }, {
      title: "Junior staff salary and structure",
      nodeRef: "workspace:\/\/SpacesStore\/ba7ca4a8-2ca4-42a7-afb1-19a3ce01a07c",
      creator: {
         forename: "Evelyn",
         surname: "Pierce",
         username: "epierce"
      },
      created: "2014-01-28T08:19:36.000Z",
      modifier: {
         forename: "Carlos",
         surname: "Kelly",
         username: "ckelly"
      },
      modified: "2015-06-06T15:36:21.000Z"
   }, {
      title: "Derby WMS",
      nodeRef: "workspace:\/\/SpacesStore\/f1822b3c-bf2b-4a2f-98ba-145364b5078d",
      creator: {
         forename: "Clarence",
         surname: "Turner",
         username: "cturner"
      },
      created: "2014-07-07T03:34:12.000Z",
      modifier: {
         forename: "Edward",
         surname: "Wagner",
         username: "ewagner"
      },
      modified: "2015-08-15T02:13:26.000Z"
   }, {
      title: "Sight Tests",
      nodeRef: "workspace:\/\/SpacesStore\/f884aa7a-af3f-4977-8d68-37c6a8ba06a8",
      creator: {
         forename: "Diane",
         surname: "Fernandez",
         username: "dfernandez"
      },
      created: "2014-03-30T04:11:37.000Z",
      modifier: {
         forename: "Craig",
         surname: "Gardner",
         username: "cgardner"
      },
      modified: "2014-11-12T16:47:36.000Z"
   }, {
      title: "Community Concern Locations",
      nodeRef: "workspace:\/\/SpacesStore\/c865e353-6b6b-4d39-b0da-441f78dd263b",
      creator: {
         forename: "Judith",
         surname: "Fowler",
         username: "jfowler"
      },
      created: "2013-10-23T19:57:23.000Z",
      modifier: {
         forename: "Maria",
         surname: "Cole",
         username: "mcole"
      },
      modified: "2015-03-29T16:20:29.000Z"
   }, {
      title: "Welwyn Hatfield",
      nodeRef: "workspace:\/\/SpacesStore\/b8c90a0f-c1da-4652-bebd-dab6a711cae3",
      creator: {
         forename: "Kimberly",
         surname: "Hayes",
         username: "khayes"
      },
      created: "2013-09-30T19:15:41.000Z",
      modifier: {
         forename: "Michael",
         surname: "Hall",
         username: "mhall"
      },
      modified: "2015-01-06T17:06:50.000Z"
   }, {
      title: "CMR WAL context data",
      nodeRef: "workspace:\/\/SpacesStore\/ba24abf8-b72b-4822-81d8-23f3ae26d017",
      creator: {
         forename: "Beverly",
         surname: "Oliver",
         username: "boliver"
      },
      created: "2014-03-25T02:05:03.000Z",
      modifier: {
         forename: "Irene",
         surname: "Garza",
         username: "igarza"
      },
      modified: "2015-02-14T13:58:14.000Z"
   }, {
      title: "NICOR Transparency Agenda page",
      nodeRef: "workspace:\/\/SpacesStore\/7905f09c-573d-4cf3-be76-b06a0020e170",
      creator: {
         forename: "Paul",
         surname: "Taylor",
         username: "ptaylor"
      },
      created: "2013-11-16T22:15:52.000Z",
      modifier: {
         forename: "Louise",
         surname: "Morrison",
         username: "lmorrison"
      },
      modified: "2015-01-31T04:27:37.000Z"
   }, {
      title: "Statistics on Alcohol",
      nodeRef: "workspace:\/\/SpacesStore\/44df6780-1f05-4e58-bbcc-43defa0540d1",
      creator: {
         forename: "Jeremy",
         surname: "Robinson",
         username: "jrobinson"
      },
      created: "2013-12-26T17:02:26.000Z",
      modifier: {
         forename: "Judith",
         surname: "Lane",
         username: "jlane"
      },
      modified: "2014-12-16T22:54:36.000Z"
   }, {
      title: "NHS Support Agencies",
      nodeRef: "workspace:\/\/SpacesStore\/eb1df0d5-266d-4f3f-8d1b-b3433316ac53",
      creator: {
         forename: "Donna",
         surname: "Olson",
         username: "dolson"
      },
      created: "2014-05-24T13:43:10.000Z",
      modifier: {
         forename: "Phillip",
         surname: "Hill",
         username: "phill"
      },
      modified: "2015-03-30T04:31:50.000Z"
   }, {
      title: "Abuse of Vulnerable Adults",
      nodeRef: "workspace:\/\/SpacesStore\/9d09c455-4ddd-4b80-b940-92a0908f209a",
      creator: {
         forename: "Karen",
         surname: "Andrews",
         username: "kandrews"
      },
      created: "2013-08-22T21:33:00.000Z",
      modifier: {
         forename: "Cheryl",
         surname: "Morris",
         username: "cmorris"
      },
      modified: "2014-10-12T11:21:28.000Z"
   }, {
      title: "MVDC Senior Salaries",
      nodeRef: "workspace:\/\/SpacesStore\/802f2ae2-b449-4bb3-91bf-f9753368fc29",
      creator: {
         forename: "Alan",
         surname: "Tucker",
         username: "atucker"
      },
      created: "2014-08-18T07:31:28.000Z",
      modifier: {
         forename: "Rebecca",
         surname: "Griffin",
         username: "rgriffin"
      },
      modified: "2015-05-05T17:18:25.000Z"
   }, {
      title: "Smoke Control Zones",
      nodeRef: "workspace:\/\/SpacesStore\/79e23e2d-6745-459f-8f19-db0d9a9237cd",
      creator: {
         forename: "Tammy",
         surname: "Gardner",
         username: "tgardner"
      },
      created: "2013-08-27T14:31:07.000Z",
      modifier: {
         forename: "Harold",
         surname: "Kim",
         username: "hkim"
      },
      modified: "2015-03-01T01:50:47.000Z"
   }, {
      title: "Salford main report",
      nodeRef: "workspace:\/\/SpacesStore\/a34aaca5-791f-4af2-9a06-62f54f60f9f2",
      creator: {
         forename: "Ralph",
         surname: "Welch",
         username: "rwelch"
      },
      created: "2013-11-18T14:51:17.000Z",
      modifier: {
         forename: "Chris",
         surname: "Spencer",
         username: "cspencer"
      },
      modified: "2015-03-05T11:27:17.000Z"
   }, {
      title: "DCSF report",
      nodeRef: "workspace:\/\/SpacesStore\/d839c565-3d44-4abf-971c-a00cfacd0aaa",
      creator: {
         forename: "James",
         surname: "Barnes",
         username: "jbarnes"
      },
      created: "2014-01-11T21:18:47.000Z",
      modifier: {
         forename: "Scott",
         surname: "Nelson",
         username: "snelson"
      },
      modified: "2014-12-23T15:35:50.000Z"
   }, {
      title: "UK CMR data",
      nodeRef: "workspace:\/\/SpacesStore\/b9170982-2760-4985-bb7c-55611c8adfe2",
      creator: {
         forename: "Evelyn",
         surname: "West",
         username: "ewest"
      },
      created: "2014-07-28T13:05:30.000Z",
      modifier: {
         forename: "Joyce",
         surname: "Brown",
         username: "jbrown"
      },
      modified: "2015-07-10T04:20:54.000Z"
   }, {
      title: "Pubic Conveniences",
      nodeRef: "workspace:\/\/SpacesStore\/0be23cc0-9d69-478f-aa34-0e7b3798f2a2",
      creator: {
         forename: "Joe",
         surname: "Henderson",
         username: "jhenderson"
      },
      created: "2014-01-11T15:41:05.000Z",
      modifier: {
         forename: "Louis",
         surname: "Russell",
         username: "lrussell"
      },
      modified: "2015-06-25T23:47:04.000Z"
   }, {
      title: "Currency and payment data",
      nodeRef: "workspace:\/\/SpacesStore\/e6bb94bd-3202-4538-8e7e-01c9c01c8656",
      creator: {
         forename: "Phyllis",
         surname: "Sullivan",
         username: "psullivan"
      },
      created: "2013-10-26T12:37:48.000Z",
      modifier: {
         forename: "Susan",
         surname: "Little",
         username: "slittle"
      },
      modified: "2014-11-07T15:02:47.000Z"
   }, {
      title: "UKCESS Northern Ireland Local Data Toolkit",
      nodeRef: "workspace:\/\/SpacesStore\/a18b8be6-9f72-4aee-82a3-144b4302c82f",
      creator: {
         forename: "Deborah",
         surname: "Kelley",
         username: "dkelley"
      },
      created: "2013-12-24T07:37:42.000Z",
      modifier: {
         forename: "Louise",
         surname: "Peterson",
         username: "lpeterson"
      },
      modified: "2015-05-29T04:53:53.000Z"
   }, {
      title: "Interactive map",
      nodeRef: "workspace:\/\/SpacesStore\/e477c410-0753-4efb-aaae-0554b03b9858",
      creator: {
         forename: "Dennis",
         surname: "Hamilton",
         username: "dhamilton"
      },
      created: "2013-09-21T15:33:39.000Z",
      modifier: {
         forename: "Ann",
         surname: "Frazier",
         username: "afrazier"
      },
      modified: "2014-12-28T08:10:38.000Z"
   }, {
      title: "Link to web page",
      nodeRef: "workspace:\/\/SpacesStore\/9f306983-c52d-43a7-84da-987edddfa40e",
      creator: {
         forename: "Kenneth",
         surname: "Murphy",
         username: "kmurphy"
      },
      created: "2014-06-17T00:39:34.000Z",
      modifier: {
         forename: "Maria",
         surname: "Mills",
         username: "mmills"
      },
      modified: "2015-02-20T00:39:54.000Z"
   }, {
      title: "General Dental Practices",
      nodeRef: "workspace:\/\/SpacesStore\/652eed48-4ade-4e7b-962e-cb8e1a65c524",
      creator: {
         forename: "Brian",
         surname: "Evans",
         username: "bevans"
      },
      created: "2014-06-14T11:43:54.000Z",
      modifier: {
         forename: "Lisa",
         surname: "Washington",
         username: "lwashington"
      },
      modified: "2015-05-19T22:33:27.000Z"
   }, {
      title: "Orkney Islands",
      nodeRef: "workspace:\/\/SpacesStore\/2ffa6d80-c104-4517-9ecc-ee4439ff5f38",
      creator: {
         forename: "Anne",
         surname: "Gardner",
         username: "agardner"
      },
      created: "2013-08-25T21:55:46.000Z",
      modifier: {
         forename: "Howard",
         surname: "Howell",
         username: "hhowell"
      },
      modified: "2014-10-06T16:22:33.000Z"
   }, {
      title: "Products archived",
      nodeRef: "workspace:\/\/SpacesStore\/6e6a1ede-1c8d-463b-8bf3-2abc7a211c90",
      creator: {
         forename: "Maria",
         surname: "Mccoy",
         username: "mmccoy"
      },
      created: "2014-04-10T06:01:28.000Z",
      modifier: {
         forename: "Nicole",
         surname: "Franklin",
         username: "nfranklin"
      },
      modified: "2014-11-29T13:16:54.000Z"
   }, {
      title: "Grievance cases by religion",
      nodeRef: "workspace:\/\/SpacesStore\/5ab3d7bd-f84a-4fb9-af33-3d47df3c4ec5",
      creator: {
         forename: "Ronald",
         surname: "Wright",
         username: "rwright"
      },
      created: "2013-11-28T17:09:49.000Z",
      modifier: {
         forename: "Sandra",
         surname: "Reynolds",
         username: "sreynolds"
      },
      modified: "2015-04-15T17:20:50.000Z"
   }, {
      title: "Current General Medical Practitioners",
      nodeRef: "workspace:\/\/SpacesStore\/c105a1de-cdb5-4c20-824f-d0d87ceee0bd",
      creator: {
         forename: "Russell",
         surname: "Fox",
         username: "rfox"
      },
      created: "2014-08-13T16:58:37.000Z",
      modifier: {
         forename: "Lois",
         surname: "Nelson",
         username: "lnelson"
      },
      modified: "2015-05-09T14:59:37.000Z"
   }, {
      title: "Publication of Tenders",
      nodeRef: "workspace:\/\/SpacesStore\/25f6f5db-5d00-4020-b873-a21d22302cb3",
      creator: {
         forename: "Janice",
         surname: "Marshall",
         username: "jmarshall"
      },
      created: "2014-04-13T18:35:46.000Z",
      modifier: {
         forename: "Beverly",
         surname: "Wells",
         username: "bwells"
      },
      modified: "2014-09-19T15:50:16.000Z"
   }, {
      title: "Notes for API Datasets",
      nodeRef: "workspace:\/\/SpacesStore\/52337774-842c-4678-ac07-90b46b90d7f6",
      creator: {
         forename: "Nicole",
         surname: "Bailey",
         username: "nbailey"
      },
      created: "2014-02-28T05:44:13.000Z",
      modifier: {
         forename: "Gloria",
         surname: "Gray",
         username: "ggray"
      },
      modified: "2015-01-06T18:52:38.000Z"
   }]
});