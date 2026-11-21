## Explain it back

A rule declared on the root path is responsible for the whole form, but by default vaalidate() attached its reeturend errors tto the field its bounded.
With error handled in fieldTree, the error fires when the field is touched and error is true
this avoid to check all status erroor on the root level