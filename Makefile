.PHONY : help
help :
	@echo "clean	: Remove auto-generated files."

clean:
	rm -f *.pyc
	rm -f websysmon/*.pyc
	rm -f websysmon/monitor/*.pyc
	rm -f -r websysmon/monitor/__pycache__
	rm -f -r websysmon/__pycache__