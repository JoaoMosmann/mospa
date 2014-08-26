publish-docs:
	mkdir -p ../mospa-docs
	grunt docs
	git init ../mospa-docs
	cd ../mospa-docs && git remote add origin git@github.com:doubleleft/mospa.git && git checkout -b gh-pages && git add .  && git commit -m "update public documentation" && git push origin gh-pages -f