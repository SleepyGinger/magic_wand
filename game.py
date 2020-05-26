import turtle

wn = turtle.Screen()
wn.title("magic")
wn.bgcolor("black")
wn.setup(width=800, height=600)
wn.tracer(0)

pen = turtle.Turtle()
pen.speed(0)
pen.color("green")
pen.penup()
pen.hideturtle()
pen.goto(-320,260)

pen.write("Moneys: $", align="center", font=("Courier", 24, "normal"))

ball = turtle.Turtle()
ball.speed(0)
ball.shape('square')
ball.color('white')
ball.penup()
ball.goto(0,0)

ball.dy = 2

current_score = 0

loop_num = 0

def add_point():
    global current_score
    current_score += .1

def minus_point():
    global current_score
    current_score -= .1

def add_point2():
    global current_score
    current_score += 2

def minus_point2():
    global current_score
    current_score -= 2

def add_loop():
    global loop_num
    loop_num += 1


wn.listen()
#wn.onkey(add_point, "space")

while True:
    wn.update()
    
    ball.sety(ball.ycor()+ball.dy)

    if loop_num == 0 :
        add_point()
        wn.listen()
        wn.onkey(minus_point2, "space")
        if ball.ycor() > 160:
            ball.sety(160)
            ball.dy *=-1
            add_loop()

    if loop_num == 1:
        minus_point()
        wn.listen()
        wn.onkey(add_point2, "space")
        if ball.ycor() < -130:
            ball.sety(-130)
            ball.dy *=-1
            add_loop()
    
    if loop_num == 2:
        add_point()
        wn.listen()
        wn.onkey(minus_point2, "space")
        if ball.ycor() > 70:
            ball.sety(70)
            ball.dy *=-1
            add_loop()
    
    if loop_num == 3:
        minus_point()
        wn.listen()
        wn.onkey(add_point2, "space")
        if ball.ycor() < -10:
            ball.sety(-10)
            ball.dy *=-1
            add_loop()
    
    if loop_num == 4:
        add_point()
        wn.listen()
        wn.onkey(minus_point2, "space")
        if ball.ycor() > 180:
            ball.sety(180)
            ball.dy *=-1
            add_loop()
    
    if loop_num == 5:
        minus_point()
        wn.listen()
        wn.onkey(add_point2, "space")
        if ball.ycor() < -10:
            ball.sety(-10)
            ball.dy *=-1
            add_loop()
    
    if loop_num == 6:
        add_point()
        wn.listen()
        wn.onkey(minus_point2, "space")
        if ball.ycor() > 90:
            ball.sety(90)
            ball.dy *=-1
            add_loop()
    
    if loop_num == 7:
        minus_point()
        wn.listen()
        wn.onkey(add_point2, "space")
        if ball.ycor() < 10:
            ball.sety(10)
            ball.dy *=-1
            add_loop()
    
    if loop_num == 8:
        add_point()
        wn.listen()
        wn.onkey(minus_point2, "space")
        if ball.ycor() > 190:
            ball.sety(190)
            ball.dy *=-1
            add_loop()

    if loop_num == 9:
        minus_point()
        wn.listen()
        wn.onkey(add_point2, "space")
        if ball.ycor() < -210:
            ball.sety(-210)
            ball.dy *=-1
            add_loop()
    
    pen.clear()
    pen.write("Moneys: ${}".format(int(current_score)), align="center", font=("Courier", 24, "normal"))