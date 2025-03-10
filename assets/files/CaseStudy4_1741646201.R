# Case Study 4 

# a.) Boston Housing Data 
# (i) Fit a regression tree (CART) on training data, Report the models in-sample
# MSE performance 
library(MASS)
library(rpart)
library(rpart.plot)
library(dplyr)

boston <- data(Boston)
sample_index <- sample(nrow(Boston), nrow(Boston)*0.90)
train <- Boston[sample_index, ]
test <- Boston[-sample_index, ]

boston_rpart <- rpart(formula = medv ~., data = train)
boston_rpart
prp(boston_rpart, digits = 4, extra = 1)

boston_train_pred_tree = predict(boston_rpart)

# Interpretation of the tree model: 