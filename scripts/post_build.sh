echo "Publishing artifacts\n"

git config --global user.email "guryanovev@gmail.com"
git config --global user.name "Travis"

git remote add upstream https://${GH_TOKEN}@github.com/guryanovev/JohnSmith.git

git checkout -B gh-pages
git add -f out/.
git commit -q -m "Travis build $TRAVIS_BUILD_NUMBER pushed to gh-pages"
git push -fq upstream gh-pages

echo -e "Artifacts published\n"