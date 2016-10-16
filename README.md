# Private Network Origin
(C) J. Férard 2016

For Thunderbird mail client. Adds a column to display sender address and if the sender is in your private network.

## *DISCLAIMER*
1. The *Private Network Origin* add-on for Thunderbird is **not** a bullet-proof security add-on, it's **not even** a real security add-on, rather a little hint for end users of the mail client who want to have reliable information on the sender.
2. The *Private Network Origin* add-on for Thunderbird is still in beta version. Please fill an issue if necessary on www.github.com/jferard/privatenwo

## Who sent me this mail?
You probably know that the name displayed in Thunderbird is not guaranteed to be the name of the sender of the mail. A mail header `From: John Doe <jester@jester.com>` will simply display `John Doe` as mail sender<sup id="a1">[1](#f1)</sup>, although the sender address is `jester@jester.com`. But even the mail address specified in that header could be wrong: it's just a return address. The real mail sender could be `badguy@badguy.com`. This makes mail a good way to attract users to and trap them in hazardous web sites, e.g. for ransomwares diffusion.

How can you protect yourself? Well, there is no simple solution. You need to implement security on the server side and on the client side too. But your security policy can't block everything, because your business will be down soon if you don't receive your mail.

The *Private Network Origin* add-on can help you, **provided some conditions**, to appreciate the origin of mail.

## How does it works?
**The main condition for the add-on to work is that you have different mail servers to handler *internal* mail and *external* mail.**

Imagine you have a corporation with:
* one mail server that handles *internal* mail, and another mail server that handles *external* mail. E.g. `internal.mail.mycorporation.com` and `external.mail.mycorporation.com`;
* a specific domain name, for instance `mycoporation.com`, and all mail addresses in your corporation are build on the following pattern: `someone@mycorporation.com` (e.g. `john.doe@mycoporation.com`).

Then it become easy to check the `Received` field in mail header, and to alert the user if `external.mail.mycorporation.com` was in the route of the mail, but this mail has a `someone@mycorporation.com` *alleged* sender address. That mail is not necessarly a fake, but should be considered with care.

## Installation
Just clone this repo:

`git clone https://www.github.com/jferard/privatenwo` 

And then, make a zip of the content, with a `xpi` extension:
* On Windows, with 7zip installed, you can type the following line in the command line `7z.exe a privatenwo-0.0.1b.xpi *`.
* On Linux or Mac Os X, use the appropriate software to create the `xpi` archive.

## Configuration
You have two informations to give to *Private Network Origin*, using the RegExp<sup id="a2">[2](#f2)</sup> format:
* a regexp for external mail server, in the case of `external.mail.mycorporation.com`, that will be `external\.mail\.mycorporation\.com`;
* a regexp for the domain name, in the case of `mycorporation.com`, that will be `mycorporation\.com`;

Then you have to add the "Sender ok?" column to the view in Thunderbird.

NB. for old messages, you will to refresh the database: just right-click the folder you want to refresh, select `Properties` from the pop-up menu, and click the `Repair Folder`.

## What does it do?
There are five cases. 
If the the mail has no sender or no received field in the header: red alert.
In the other cases:

||internal mail route|external mail route|
|---|---|---|
|**your domain alleged sender**|nothing (ok)|orange warning (coud be a fake)|
|**another domain alleged sender**|orange warning (unusual)|yellow info (standard external mail)|

<b id="f1">1</b>See https://tools.ietf.org/html/rfc2822#section-3.4 [&#8617;](#a1)

<b id="f2">2</b>https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/RegExp [&#8617;](#a2)