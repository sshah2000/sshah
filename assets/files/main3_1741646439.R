
data <- read.csv("C:/Users/sshah/Downloads/obesity.csv")
colnames(data)
str(data)

summary(data)

subset <- sample(nrow(data), nrow(data) * 0.9)
train = data[subset, ]
test = data [-subset, ]

##-----------------------------Exploratory Data--------------------------
hist(data$Age, main = "Age Distribution", xlab = "Age", col = "blue")
# From the main data, we are able to see that the data is right skewed, with more people being in their 
# 20s. 


hist(data$Height, main = "Height Distribution", xlab = "Height (m)", col = "red")
#This data is symmetrical with it being skewed slightly to the left From this, we are able to see 
# the more than 200 people have a height greater than 1.8 meters. 

hist(data$Weight, main = "Weight Distribution", xlab = "Weight (kg)", col = "orange")
# Weights are distributed between 40kg to 160kg 
# Most weights are concentrated between 60kg and 100kg
# Most individuals weigh between 60-100kg, which means it is right skewed

x <- data$Weight
y <- data$Height

plot(jitter(x),jitter(y), xlab = "Weight (kg)" , ylab = "Height (m)")

plot(density(data$Weight)) # Used the book for this one 

boxplot(Weight ~ NObeyesdad, data = data)


##---------------------Linear Regression---------------------------------

# This model would have weight as a dependent factor, using all variables 
model_1 <- lm(Weight~., data=train)
summary(model_1)

# Evaluating the model fitness 
# In Sample

model_summary <- summary(model_1)
(model_summary$sigma)^2 

model_summary$r.squared 
model_summary$adj.r.squared

AIC(model_1) 
BIC(model_1) 

# Out of Sample 
pi <-predict(model_1, test)
mean((pi-test$Weight)^2)

mean(abs(pi-test$Weight))

library(leaps)

subset_result <- regsubsets(Weight ~ ., data = train,
                            nbest = 2, nvmax = 28)

plot(subset_result, scale = "bic")

nullmodel = lm(Weight ~1, data = train)
fullmodel = lm(Weight ~., data = train)
summary(subset_result)

model.step <- step(nullmodel, scope = list(lower = nullmodel,
                                           upper = fullmodel),
                   direction = "both")

extractAIC(model_1)
AIC(model_1)

#-------------------------Regression Tree using weight ------------------------------------

library(rpart)
library(rpart.plot)

data_rpart <- rpart(formula = Weight ~ ., data = train)
data_rpart
prp(data_rpart, digits = 4, extra = 1)

# This would represent the in sample prediction
data_train_pred_tree = predict(data_rpart)

# Out of Sample Prediction
data_test_pred_tree = predict(data_rpart, test)

# MSE Train
mse.tree <- mean((data_train_pred_tree - train$Weight)^2)
print(mse.tree)

mpse.tree <- mean((data_test_pred_tree - test$Weight)^2)
print(mpse.tree)

# Comparing (Please use the LM model shown earlier)
data_train_pred_lm = predict(model_1, train)
mse.lm <- mean((data_train_pred_lm - train$Weight)^2)

data_test_pred_lm = predict(model_1, test)
mpse.lm <- mean((data_test_pred_lm - test$Weight)^2)

data_largetree <- rpart(formula = Weight ~., data=train, cp=0.0001)
prp(data_largetree)
plotcp(data_largetree)

printcp(data_largetree)

sum((train$Weight - mean(train$Weight))^2)/nrow(train)
mean((predict(data_largetree) - train$Weight)^2)

# Out-of-sample prediction
data_test_pred_tree <- predict(data_largetree, test)
mean((data_test_pred_tree - test$Weight)^2)

prune(data_largetree, cp = 0.0015)
prp(data_largetree)

## ----------------- Random Forest ------------------------------------------
# The book has categorical which is why it is not working, 

library(randomForest)
rf <- randomForest(Weight ~ ., data = train, ntree = 100, proximity=FALSE)
print(rf)
plot(rf)
importance(rf)
varImpPlot(rf)

test_pred_rf <- predict(rf, newdata = test)
mean((test_pred_rf - test$Weight)^2)


## The above code is used from the book, the bottom one would represent Stack Overflow
## Personally I will not use it, I do not want Academic Dishonesty. Hence look at the examples
# for linear and logistic regression. Follow the similar format as it is comparing values right? 


test_prediction <- predict(rf, newdata = test)
residual_rf <- test$Weight - test_prediction
mse_rf <- mean((predict(rf, newdata = train)-train$Weight)^2)
print(mse_rf)



