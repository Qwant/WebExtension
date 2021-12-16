
# Build Firefox Extension Without Docker

Install dependencies
`
yarn install
`
Generate manifest
`
cat public/manifest.template.json | sed "s/__XXX_browser_XXX__/firefox/g" > public/manifest.json
`
Build code
`
yarn build
`

# Build Chrome Extension Without Docker

Install dependencies
`
yarn install
`
Generate manifest
`
cat public/manifest.template.json | sed "s/__XXX_browser_XXX__/chrome/g" > public/manifest.json
`
Build code
`
yarn build
`
