#!/bin/bash


#svnVersion=`/usr/bin/svn info | grep Revision | cut -d: -f2 | cut -d' ' -f2`
svnVersion=`/usr/bin/svn up | grep "At revision" | cut -d ' ' -f3 | cut -d. -f1`
echo Get version svn: $svnVersion

updateVersion=`cat package.json | grep version | awk -F "\"" '{print $4}' | awk 'gsub(/[0-9]+$/, "")'`
echo Get version package: $updateVersion

newVersion=$updateVersion$svnVersion
echo Merged version: $newVersion

regPattern='s/\(version.*\)[0-9]\{1,\}\.[0-9]\{1,\}\.[0-9]\{1,\}/\1'$newVersion'/'
sedResult=`sed -i "" $regPattern package.json`
#echo $sedResult

autoUpdate=`svn ci -m 'auto update from ${newVersion}' package.json`

svnVersionNow=`/usr/bin/svn up | grep "At revision" | cut -d ' ' -f3 | cut -d. -f1`
echo svn reach to: $svnVersionNow

echo starting publish
/usr/local/bin/npm publish

