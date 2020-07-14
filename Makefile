.PHONY : help
help :
	@echi "rundbg   : Run flask app in debug mode."
	@echo "clean	: Remove auto-generated files."

rundbg:
	FLASK_APP=websysmon FLASK_ENV=development flask run

clean:
	rm -f *.pyc
	rm -f websysmon/*.pyc
	rm -f websysmon/monitor/*.pyc
	rm -f -r websysmon/monitor/__pycache__
	rm -f -r websysmon/__pycache__