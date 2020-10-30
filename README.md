# Music genre classification DEMO with Audioset

Frontend app for Music Genre classification demo using Audioset. https://jramcast.github.io/mgr-app/.

## Citations

This application is a demo of the research conducted for the following study:

* [Machine learning for music genre: multifaceted review and experimentation with audioset](https://link.springer.com/article/10.1007/s10844-019-00582-9)

[Read the article](https://rdcu.be/b87uq).

**If you use this code or wish to reference this work, please cite it as**:

> Ramírez, J., Flores, M.J. Machine learning for music genre: multifaceted review and experimentation with audioset. J Intell Inf Syst 55, 469–499 (2020). https://doi.org/10.1007/s10844-019-00582-9

## Related repositories

The repository for the application backend is: https://github.com/jramcast/mgr-service

The repository for models training code is: https://github.com/jramcast/music-genre-classification-audioset

## Development

### To release a build

```sh
npm run build
```

Then, go to `dist/`, commit changes in **gh-pages** branch, and push them:

```sh
git commit -a -m "Build"
git push origin gh-pages
```

More detailed instructions in https://medium.com/linagora-engineering/deploying-your-js-app-to-github-pages-the-easy-way-or-not-1ef8c48424b7

