#!/bin/bash

cat public/manifest.template.json | sed "s/__XXX_browser_XXX__/$@/g" > public/manifest.json
yarn build
rm -fr "build-$@"
mv build "build-$@"
