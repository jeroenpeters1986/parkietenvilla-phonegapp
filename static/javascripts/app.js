function serializeContactForm()
{
    var elems = document.forms[0].elements;
    var len = elems.length;
    var formdata = new Object();
    var i = 0;

    for(i = 0; i < len; i += 1)
    {
        var element = elems[i];
        var name = element.name;
        var value = element.value;
        if(name == "" || value == "" || name == undefined || value == undefined)
        {
            continue;
        }
        formdata[name] = value;
    }
    formdata['_wpcf7_is_ajax_call'] = 1;
    return formdata;
}

Lungo.ready(function() {

    Lungo.dom('li#menu-pv-tekoop').tap(function(event)
    {
        var te_koop_pagina = "http://www.parkietenvilla.nl/te-koop/?json=get_page";
        var data = {};
        var parseResponse = function(result)
        {
            var pv_te_koop_html_content = result.page.content;
            Lungo.dom('div#pv-tekoop-pagecontent').html(pv_te_koop_html_content);
        };
        Lungo.Service.Settings.crossDomain = true;
        Lungo.Service.json(te_koop_pagina, data, parseResponse, "json");
    });

    Lungo.dom('li#menu-pv-potd, button#potdrefresh').tap(function(event)
    {
        Lungo.dom('div#pv-potd-foto').html('');
        Lungo.dom('div#potdloading').show();
        var potd_page = "http://www.parkietenvilla.nl/foto-van-de-dag/";
        var data = {};
        var parseResponse = function(result)
        {
            var pv_potd = result;
            var re = /<div id="wppa\b[^>]*>([\s\S]*?)<\/div>/gm;

            var match, plaatje;
            while (match = re.exec(pv_potd)) {
                if(match[1].length > 100)
                {
                    picture_html = match[1].replace('style=" max-width:300px; max-height:225px; width:300px; height:225px;margin:0;"', '');
                    Lungo.dom('div#potdloading').hide();
                    Lungo.dom('div#pv-potd-foto').html(picture_html);
                }
            }
        };
        Lungo.Service.Settings.crossDomain = true;
        Lungo.Service.get(potd_page, data, parseResponse, "html");
    });

    Lungo.dom('li#menu-pv-contact').tap(function(event)
    {
        var contactpagina = "http://www.parkietenvilla.nl/contact/?json=get_page";
        var data = {};
        var parseResponse = function(result)
        {
            var pv_contact_html_content = result.page.content;
            Lungo.dom('div#pv-contact-formulier').html(pv_contact_html_content);
            Lungo.dom('div#pv-contact-formulier input[type=text]').toggleClass("border");
            Lungo.dom('div#pv-contact-formulier input[type=email]').toggleClass("border");
            Lungo.dom('div#pv-contact-formulier textarea').toggleClass("border");
            Lungo.dom('div#pv-contact-formulier .bootstrap-button').addClass("form").html(
                '<button class="anchor accept margin-bottom" type="button" id="just-pretend-to-send">' +
                    '<span class="icon ok"></span><abbr>Verzenden!</abbr></button>');

            Lungo.dom('#just-pretend-to-send').on('tap', function(event){

                $$.ajax({
                    type: 'POST',
                    url: 'http://www.parkietenvilla.nl/contact/',
                    contentType: 'application/x-www-form-urlencoded',
                    data: serializeContactForm(),
                    dataType: 'html',
                    success: function(response) {
                        response = response.replace("<textarea>", "");
                        response = response.replace("</textarea>", "");
                        var mailform = JSON.parse(response);

                        if(mailform['mailSent'] == true)
                        {
                            Lungo.Notification.success("Gelukt", "Het versturen van het contactformulier is gelukt!", "check", 4);
                            Lungo.dom('div#pv-contact-formulier').html("Het versturen van het contactformulier is gelukt!");
                        }
                        else
                        {
                            Lungo.Notification.error("Mislukt", mailform['message']);
                        }
                    },
                    error: function(xhr, type)
                    {
                        Lungo.Notification.error("Mislukt", "Het versturen is helaas mislukt, probeer het nog eens");
                    }
                });

                event.preventDefault();
                return false;
            });
        };
        Lungo.Service.Settings.crossDomain = true;
        Lungo.Service.json(contactpagina, data, parseResponse, "json");
    });


    Lungo.dom('#quiz-show-results').tap(function(event) {
        parkietenquiz();
    });

    Lungo.dom('#quiz-reset').tap(function(event) {
        Lungo.Notification.confirm({
            title: 'Weet je het zeker?',
            description: 'Dit zal al je ingevulde antwoorden wissen!',
            accept: {
                icon: 'checkmark',
                label: 'Ja',
                callback: function(){
                    document.parkietenquizform.reset();
                }
            },
            cancel: {
                icon: 'close',
                label: 'Nee'
            }
        });
    });
});
