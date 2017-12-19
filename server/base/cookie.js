'use strict'

// 是否用开源的cookies包
// https://www.npmjs.com/package/cookies
// https://github.com/expressjs/cookie-session


exports.getHandler = function ( req, res ) {
    let cookies = {}

    if ( !( '__addCookie' in req ) ) {
        req.__addCookie = []
    }

    if ( !req.__cookies ) {
        //read cookie
        req.headers.cookie && req.headers.cookie.split( ';' ).forEach( function ( cookie ) {
            let ppos = cookie.indexOf( '=' ),
                p1   = cookie.slice( 0, ppos ),
                p2   = cookie.slice( ppos + 1 )

            cookies[ p1.trim() ] = decodeURIComponent( (p2 || '').trim() )
        } )
        req.__cookies = cookies
    } else {
        cookies = req.__cookies
    }

    let host = req.headers.host || ''

    if ( host ) {
        host = 'domain=.' + host.split( '.' ).slice( -2 ).join( '.' ) + ';'
    }

    function set( name, val, expires, set_host ) {
        if ( set_host ) set_host = 'domain=' + set_host + ';'
        if ( !res ) return
        if ( arguments.length == 1 ) {
            var cookie_v = name
        } else {
            val          = encodeURIComponent( val )
            var cookie_v = name + '=' + val + ';Path=/;' + (set_host || host)
            if ( expires )
                cookie_v += 'expires=' + expires.toGMTString() + ';'

            cookies[ name ] = val
        }
        if ( req.__addCookie.indexOf( cookie_v ) < 0 ) {
            if ( req.__addCookie.length < 15 ) {
                req.__addCookie.push( cookie_v )
            }
            try {
                res.setHeader( 'set-cookie', req.__addCookie )
            } catch ( e ) {
                console.error( 'Cookie unwrite', name, e )
            }
        }
    }

    function get( name ) {
        return cookies[ name ]
    }

    function clear( name ) {
        return set( name, '' )
    }

    return {
        set,
        get,
        clear
    }
}
