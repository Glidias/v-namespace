# v-namespace
Adds custom prefix to all class declarations within v-namespace blocks for your CSS/SCSS files/strings.

    var doPrefix = require("v-namespace");
    var css = `
        @include v-namespace('some-custom-prefix-') {
            .comp {
                color:black;
                .btn {
                    color:white;
                }
                .a.b { color:red; }
            }
        }
    `;
    css = doPrefix(css);

Mainly used for distributing css-skinnable (but having completely self-contained base css styles) modular components anywhere (with a specific namespace) and providing a way of ensuring it's css class declarations will not be affected by any holding global/parenting css class names you may end up using anywhere else on your site/app.

Just enclose your SCSS/CSS content some kind of `@include v-namespace("prefixNamespaceGoesHere-") {` block `}` mixin stub directive. Any content within that namespaced block  scope with _`./{some alphabet}/`_  (ie. a dot and then an alphabet) will be assumed to be a class identifier, and will be prepended with the literal string as specified in the namespace directive.

Example:

    #my-home-page {
       .splash-container {
           @include v-namespace('some-custom-prefix-') {
              .listitem {
                  background-color:#33141F;
              }
              .col-md-8 {
                  display:flex;
              }
              @include v-namespace('another-custom-prefix-') {
                  .listitem {
                      background-color:#aabbcc;
                  }
              }
              .listitem-k {
                 background-color:orange;
              }
           }
       }
    }
    
will become this:

    #my-home-page {
       .splash-container {
         
              some-custom-prefix-listitem {
                  background-color:#33141F;
              }
              .some-custom-prefix-col-md-8 {
                  display:flex;
              }
             
                  .another-custom-prefix-listitem {
                      background-color:#aabbcc;
                  }
              
              .some-custom-prefix-listitem-k {
                 background-color:orange;
              }
           
       }
    }
    
As you can see, namespacing can be nested as well and will be scoped accordingly.
  
If you are running under SCSS, you can specify a variable name for the component prefix like `@include v-namespace($varName)`. The namespace prefix will be translated as `#{$varName}` according to SCSS conventions, and will produce something like _`.#{$varName}className {`_. If you use variable references, you can manage all custom skinning component namespaces from a central location.

## Flags

Custom flags can be enabled within the 2nd parameter of the `v-namespace()` function. 

Eg. `v-namespace('the-prefix-', 'mixed')`.

### mixed

Specifies an explicit 'mixed' scope for  the `v-namespace`. When in this mode, you need to prepend all "namespacing" class names with a `-` prefix in from of the `.` dot. This allows you to mix both namespaced and global scopes together without having to re-declare an empty string namespace block for global scope.

Example:

    @include v-namespace('some-custom-prefix_', 'mixed') {
         .comp {
             .-class-name {
                  color:red;
              } 
             .googlemaps {
                    background-color:black;
              }
          }
    }
  
  becomes
  
        .some-custom-prefix_comp {
             .some-custom-prefix_class-name {
                  color:red;
              } 
             .googlemaps {
                    background-color:black;
              }
         }
   
 As you can see, only the `.-` pattern is replaced by the prefix.
 
# Some Caveats
 
For simplicity of implementation, the code involves naive find and replace. So it might accidentally replace some strings (particularly within css comments) that might end up being mistaken as CSS class names. 

Also, it won't support namespacing any SCSS `@include` directives or mixins directly within the namespace block and it's only Find+Replace over the current document, and doesn't involve an actual AST (Abstract syntax tree) preprocessor that could modify the way the actual file works at compile time itself.  (Anyone know of a SASS AST preprocessor that works with no issues?). However, the advantage is that this might work over any other language besides SCSS/CSS, ie. over plain CSS and even other style syntaxes that would have no issue with the Fond+Replace routine.

It's best to leave your CSS code uncommented within namespaced blocks, and/or ensure any `.` dot character has a leading space after it to avoid accidental find+replace prefixing. eg. Use of `content:` CSS property would be particular tricky if you need to have an alphabet directly after a preceding dot, and you might have to resort to SCSS variable names declared outside of any component namespaced block to get around the caveat.
 
 
# Gulp integration
 
Go to the following URL for gulp integration of this library:
 
https://github.com/Glidias/gulp-v-namespace/
