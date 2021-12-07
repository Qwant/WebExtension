
# Build Firefox Extension Without Docker

`
yarn install
cat public/manifest.template.json | sed "s/__XXX_browser_XXX__/firefox/g" > public/manifest.json
yarn build
rm -fr "build-firefox"
mv build "build-firefox"
`

