# KV Meta-Sintaxis Web App 🧩

**Interactive web tool for designing, visualizing, and analyzing the meta-syntax of custom programming languages.**

## ✨ Overview

**KV Meta-Sintaxis** is a browser-based tool that lets language designers **edit**, **visualize**, **analyze**, and **generate examples** from their own _meta-syntax_ definitions.

| Notation                            | Definition                        |
| ----------------------------------- | --------------------------------- |
| `:`                                 | Define rule                       |
| `\|`                                | Sequence of alternatives (one of) |
| `{}`                                | Repetition (zero or more)         |
| `[]`                                | Optional                          |
| `()`                                | Grouping                          |
| `CAPITALIZED`<br/>or<br/>`"quoted"` | Terminal                          |

Example:

```kvms
/;
  ¡Comentario!
;/

expresión   : ["f" "="] igualdad   ; Comentario
igualdad    : comparación {  ( "=" | "!="  ) comparación   }
comparación : término     {  ( "<" | "<="  | ">="   | ">=" ) término }
término     : factor      {  ( "+" | "-"   ) factor }
factor      : unario      {  ( "*" | "/"   ) unario }
unario      : primario    |  ( "-" | "!"   ) unario
primario    : NÚMERO      | "(" expresión ")"
```

## 💻 Contributing

Contributions welcome!

1. Fork the repository
2. Clone your fork

   ```bash
   git clone <URL of your fork>
   cd kv-meta-sintaxis
   ```

3. Create your feature branch

   ```bash
   git switch -c feature/my-feature
   ```

4. Commit your changes

   ```bash
   git add .
   git commit -m "(feat) Rode a Dragon"
   ```

5. Push to the branch

   ```bash
   git push -u origin feature/my-feature
   ```

6. Open a pull request 🎉
   - Go to your forked repository
   - Create new Pull Request
   - Provide a clear title and description
     - What you did
     - Why you did it
     - Screenshots with before and after

7. Address feedback and iterate (if applicable)
   - When you push to your fork, PRs are automatically updated
     - (I think)

8. Merged! (maybe)
   - Once approved, your Pull Request may be merged into the main project

## 🧾 About the code

Source available © 2025 • _KV Meta-Sintaxis Project_

## 

> Built with ❤️ by language designer, for language designers.
