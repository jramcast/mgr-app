# Music genre classification DEMO with Audioset

Frontend app for Music Genre classification demo using Audioset. https://jramcast.github.io/mgr-app/.

## Citations

This application is a demo of the research conducted for the following study:

* [Machine learning for music genre: multifaceted review and experimentation with audioset](https://link.springer.com/article/10.1007/s10844-019-00582-9)

If you wish to reference this work, please cite it as:

> Ramírez, J. & Flores, M.J. J Intell Inf Syst (2019). https://doi.org/10.1007/s10844-019-00582-9

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
