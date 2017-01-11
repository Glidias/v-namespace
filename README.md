# v-namespace
Adds custom prefix to all class declarations within v-namespace blocks for your CSS/SCSS files.


Just enclose your SCSS/CSS content some kind of `@include v-namespace("prefixNamespaceGoesHere-") {` block `}` mixin stub directive. Any content within that namespaced block  scope with _`./{some alphabet}/`_  (ie. a dot and then an alphabet) will be assumed to be a class identifier, and will be prepended with the literal string as specified in the namespace directive.

Example:

    #my-home-page {
       .splash-container {
           @include v-namespace('some-custom-prefix-') {
              .listitem {
                  background-color:#33141F;
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
             
                  .another-custom-prefix-listitem {
                      background-color:#aabbcc;
                  }
              
              .some-custom-prefix-listitem-k {
                 background-color:orange;
              }
           
       }
    }
  
If you are running under SCSS, you can specify a variable name for the component prefix like `@include v-namespace($varName)`. The namespace prefix will be translated as `#{$varName}` according to SCSS conventions, and will produce something like _`.#{$varName}className {`_.

## Flags

Custom flags can be enabled within the 2nd parameter of the `v-namespace()` function. 

Eg. `v-namespace('the-prefix-', 'mixed')`.

### mixed

Specifies an explicit 'mixed' scope for  the `v-namespace`. When in this mode, you need to prepend all "namespacing" class names with a `-` prefix in from of the `.` dot. This allows you to mix both namespaced and global scopes together without having to re-declare an empty string namespace block for global scope.

Example:

    @include v-namespace('some-custom-prefix-', 'mixed') {
         .-class-name {
              color:red;
          } 
         .googlemaps {
                background-color:black;
          }
    }
  
  becomes
  

         .some-custom-prefix_class-name {
              color:red;
          } 
         .googlemaps {
                background-color:black;
          }
   
 As you can see, only the `.-` pattern is replaced by the prefix.
 
 # Gulp integration
 
 Go to the following URL for gulp integration of this library:
 
 https://github.com/Glidias/gulp-v-namespace/
