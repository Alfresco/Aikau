#!/bin/bash

# Directories
PROJECT_ROOT=$(git rev-parse --show-toplevel)
PROJECT_HOOKS=$PROJECT_ROOT/aikau/resources/git/hooks/*
HOOK_DIR=$PROJECT_ROOT/.git/hooks
# HOOK_NAMES="applypatch-msg pre-applypatch post-applypatch pre-commit prepare-commit-msg commit-msg post-commit pre-rebase post-checkout post-merge pre-receive update post-receive post-update pre-auto-gc"

# Loop through files in project hooks dir
for filename in $PROJECT_HOOKS; do
   HOOK_FILENAME=${filename##*/}

    # # If the hook already exists, is executable, and is not a symlink
    # if [ ! -h $HOOK_DIR/$hook -a -x $HOOK_DIR/$hook ]; then
    #     mv $HOOK_DIR/$hook $HOOK_DIR/$hook.local
    # fi
    # # create the symlink, overwriting the file if it exists
    # # probably the only way this would happen is if you're using an old version of git
    # # -- back when the sample hooks were not executable, instead of being named ____.sample
    # ln -s -f ../../bin/hooks-wrapper $HOOK_DIR/$hook
done


