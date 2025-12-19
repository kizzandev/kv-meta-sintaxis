export const SIMPLE_EXAMPLE = `/;
  ¡Comentario!
;/

expresión   : igualdad  ; Inicio
igualdad    : comparación {  ( "=" | "!="  ) comparación   }
comparación : término     {  ( "<" | "<="  |  ">"   | ">=" ) término }
término     : factor      {  ( "+" | "-"   ) factor }
factor      : unario      {  ( "*" | "/"   ) unario }
unario      : primario    |  ( "-" | "!"   ) unario
primario    : NÚMERO      | "(" expresión ")"
`;

export const COMPLEX_EXAMPLE = `/;
  Complex Programming Language Grammar
;/

program     : { statement }

statement   : var_decl
            | assignment
            | if_stmt
            | while_stmt
            | fn_decl
            | call_stmt
            | print_stmt

var_decl    : "let" IDENTIFIER [ "=" expression ] ";"

assignment  : IDENTIFIER "=" expression ";"

if_stmt     : "if" "(" expression ")" block [ "else" block ]

while_stmt  : "while" "(" expression ")" block

fn_decl     : "fn" IDENTIFIER "(" [ params ] ")" block

params      : IDENTIFIER { "," IDENTIFIER }

block       : "{" { statement } "}"

call_stmt   : IDENTIFIER "(" [ args ] ")" ";"

args        : expression { "," expression }

print_stmt  : "print" expression ";"

expression  : logic_or

logic_or    : logic_and { "||" logic_and }

logic_and   : equality { "&&" equality }

equality    : comparison [ ( "==" | "!=" ) comparison ]

comparison  : term [ ( "<" | "<=" | ">" | ">=" ) term ]

term        : factor { ( "+" | "-" ) factor }

factor      : unary { ( "*" | "/" ) unary }

unary       : ( "!" | "-" ) unary | primary

primary     : IDENTIFIER
            | NUMBER
            | STRING
            | "true"
            | "false"
            | "(" expression ")"
`;
