const WEBFINGER_JSON = {
    "subject":"acct:adiaz@social.lol",
    "aliases":[
        "https://social.lol/@adiaz",
        "https://social.lol/users/adiaz"
    ],
    "links":[
        {
            "rel":"http://webfinger.net/rel/profile-page",
            "type":"text/html",
            "href":"https://social.lol/@adiaz"
        },
        {
            "rel":"self","type":"application/activity+json",
            "href":"https://social.lol/users/adiaz"
        },
        {
            "rel":"http://ostatus.org/schema/1.0/subscribe",
            "template":"https://social.lol/authorize_interaction?uri={uri}"
        },
        {
            "rel":"http://webfinger.net/rel/avatar",
            "type":"image/jpeg",
            "href":"https://fsn1.your-objectstorage.com/social-lol/accounts/avatars/113/428/894/369/968/790/original/1998f38214a63bbf.jpeg"
        }
    ]
}

export async function GET() {
  return new Response(JSON.stringify(WEBFINGER_JSON), {
    headers: {
      "Content-Type": "application/activity+json",
    },
  });
}