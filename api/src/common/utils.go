package common

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	validator "gopkg.in/go-playground/validator.v8"
)

// BaseError helps return customized Error info
//  {"database": {"hello":"no such table", error: "not_exists"}}
type BaseError struct {
	Errors map[string]interface{} `json:"errors"`
}

// NewValidatorError handles the error returned by c.Bind in gin framework
// https://github.com/go-playground/validator/blob/v9/_examples/translations/main.go
func NewValidatorError(err error) BaseError {
	res := BaseError{}
	res.Errors = make(map[string]interface{})
	errs := err.(validator.ValidationErrors)
	for _, v := range errs {
		// can translate each error one at a time.
		//fmt.Println("gg",v.NameNamespace)
		if v.Param != "" {
			res.Errors[v.Field] = fmt.Sprintf("{%v: %v}", v.Tag, v.Param)
		} else {
			res.Errors[v.Field] = fmt.Sprintf("{key: %v}", v.Tag)
		}

	}
	return res
}

// NewError warps the error info in a object
func NewError(key string, err error) BaseError {
	res := BaseError{}
	res.Errors = make(map[string]interface{})
	res.Errors[key] = err.Error()
	return res
}

// Changed the c.MustBindWith() ->  c.ShouldBindWith().
// I don't want to auto return 400 when error happened.
// origin function is here: https://github.com/gin-gonic/gin/blob/master/context.go
func Bind(c *gin.Context, obj interface{}) error {
	b := binding.Default(c.Request.Method, c.ContentType())
	fmt.Println(c.Request.Method)
	fmt.Println(obj)
	return c.ShouldBindWith(obj, b)
}
